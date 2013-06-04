Balanced.WithdrawFundsModalView = Balanced.BaseFormView.extend({
    templateName: 'modals/withdraw_funds',

    formProperties: ['source_uri'],

    dollar_amount: null,

    selected_bank_account: function () {
        if (this.get('model.source_uri')) {
            return Balanced.BankAccount.find(this.get('model.source_uri'));
        }
    }.property('model.source_uri'),

    open: function () {
        var verified_bank_accounts = this.get('marketplace.owner_customer.verified_bank_accounts');
        var source_uri = (verified_bank_accounts && verified_bank_accounts.length > 0) ? verified_bank_accounts[0].get('uri') : null;

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
        var self = this;
        var credit = this.get('model');

        credit.set('amount', Balanced.Utils.dollarsToCents(this.get('dollar_amount')));

        credit.one('didCreate', function () {
            self.get('marketplace').refresh();
            $('#withdraw-funds').modal('hide');
        });

        credit.on('becameInvalid', function (json) {
            self.highlightErrorsFromAPIResponse(json);
        });

        credit.create();
    }
});
