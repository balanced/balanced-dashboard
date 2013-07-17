Balanced.AddFundsModalView = Balanced.BaseFormView.extend({
    templateName: 'modals/add_funds',

    formProperties: ['source_uri'],

    dollar_amount: null,

    isSubmitting: false,

    selected_bank_account: function () {
        if (this.get('model.source_uri')) {
            return Balanced.BankAccount.find(this.get('model.source_uri'));
        }
    }.property('model.source_uri'),

    verified_bank_accounts: function () {
        return this.get('marketplace.owner_customer.verified_bank_accounts');
    }.property('marketplace.owner_customer.verified_bank_accounts'),

    open: function () {
        this.set('isSubmitting', false);

        var verified_bank_accounts = this.get('marketplace.owner_customer.verified_bank_accounts');
        var source_uri = (verified_bank_accounts && verified_bank_accounts.length > 0) ? verified_bank_accounts[0].get('uri') : null;

        var debit = Balanced.Debit.create({
            uri: this.get('marketplace.owner_customer.debits_uri'),
            source_uri: source_uri,
            amount: null
        });

        this.set('dollar_amount', null);
        this.set('model', debit);
        this.reset(debit);

        $('#add-funds').modal('show');
    },

    save: function () {
        if(this.get('isSubmitting')) {
            return;
        }
        this.set('isSubmitting', true);

        var self = this;
        var debit = this.get('model');

        var cents = null;
        try {
            cents = Balanced.Utils.dollarsToCents(this.get('dollar_amount'));
        } catch (error) {
            this.set('isSubmitting', false);
            debit.set('validationErrors', {'amount': error});
            return;
        }
        debit.set('amount', cents);

        debit.create().then(function() {
            self.set('isSubmitting', false);
            self.get('marketplace').refresh();
            $('#add-funds').modal('hide');
        }, function() {
            self.set('isSubmitting', false);
            self.highlightErrorsFromAPIResponse(json);
        });
    }
});
