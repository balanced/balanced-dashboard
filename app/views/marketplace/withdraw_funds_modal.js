Balanced.WithdrawFundsModalView = Balanced.View.extend({
    templateName: 'modals/withdraw_funds',

    dollar_amount: null,

    selected_bank_account: function () {
        if (this.get('model.source_uri')) {
            return Balanced.BankAccount.find(this.get('model.source_uri'));
        }
    }.property('model.source_uri'),

    bank_accounts: function () {
        return this.get('marketplace.owner_customer.bank_accounts');
    }.property('marketplace.owner_customer.bank_accounts'),

    open: function () {
        var self = this;
        this.get('marketplace.owner_customer.bank_accounts').then(function(bank_accounts) {
            var source_uri = (bank_accounts && bank_accounts.get('content').length > 0) ? bank_accounts.get('content')[0].get('uri') : null;

            var credit = Balanced.Credit.create({
                uri: self.get('marketplace.owner_customer.credits_uri'),
                source_uri: source_uri,
                amount: null
            });

            self.set('dollar_amount', null);
            self.set('model', credit);

            $('#withdraw-funds').modal('show');
        });
    },

    save: function () {
        if (this.get('model.isSaving')) {
            return;
        }

        var self = this;
        var credit = this.get('model');

        var cents = null;
        try {
            cents = Balanced.Utils.dollarsToCents(this.get('dollar_amount'));
        } catch (error) {
            credit.set('validationErrors', {'amount': error});
            return;
        }
        credit.set('amount', cents);

        credit.create().then(function () {
            self.get('marketplace').refresh();
            $('#withdraw-funds').modal('hide');
        });
    }
});
