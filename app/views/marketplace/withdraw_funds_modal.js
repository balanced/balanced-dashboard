Balanced.WithdrawFundsModalView = Balanced.BaseFormView.extend({
    templateName: 'modals/withdraw_funds',

    formProperties: ['source_uri'],

    dollar_amount: null,

    selected_bank_account: function () {
        return Balanced.BankAccount.find(this.get('model.source_uri'));
    }.property('model.source_uri'),

    open: function () {
        var credit = Balanced.Credit.create({
            uri: this.get('marketplace.owner_customer.credits_uri'),
            source_uri: this.get('marketplace.owner_customer.bank_accounts')[0].get('uri'),
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

        ////
        // Convert dollars to cents
        ////
        credit.set('amount', parseInt(this.get('dollar_amount') * 100, 10));

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
