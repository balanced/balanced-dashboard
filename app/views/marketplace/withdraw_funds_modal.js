Balanced.WithdrawFundsModalView = Balanced.BaseFormView.extend({
    templateName: 'modals/withdraw_funds',

    formProperties: ['source_uri'],

    dollar_amount: null,

    isSubmitting: false,

    selected_bank_account: function () {
        if (this.get('model.source_uri')) {
            return Balanced.BankAccount.find(this.get('model.source_uri'));
        }
    }.property('model.source_uri'),

    bank_accounts: function () {
        return this.get('marketplace.owner_customer.bank_accounts');
    }.property('marketplace.owner_customer.bank_accounts'),

    open: function () {
        this.set('isSubmitting', false);
        var bank_accounts = this.get('marketplace.owner_customer.bank_accounts');
        var source_uri = (bank_accounts && bank_accounts.length > 0) ? bank_accounts[0].get('uri') : null;

        var credit = Balanced.Credit.create({
            uri: this.get('marketplace.owner_customer.credits_uri'),
            source_uri: source_uri,
            amount: null
        });

        this.set('dollar_amount', null);
        this.set('model', credit);
        this.reset(credit);

        $('#withdraw-funds').modal('show');
    },

    save: function () {
        if(this.get('isSubmitting')) {
            return;
        }

        this.set('isSubmitting', true);
        var self = this;
        var credit = this.get('model');

        var cents = null;
        try {
            cents = Balanced.Utils.dollarsToCents(this.get('dollar_amount'));
        } catch (error) {
            this.set('isSubmitting', false);
            credit.set('validationErrors', {'amount': error});
            return;
        }
        credit.set('amount', cents);

        credit.create().then(function() {
            self.set('isSubmitting', false);
            self.get('marketplace').refresh();
            $('#withdraw-funds').modal('hide');
        }, function() {
            self.set('isSubmitting', false);
            self.highlightErrorsFromAPIResponse(json);
        });
    }
});
