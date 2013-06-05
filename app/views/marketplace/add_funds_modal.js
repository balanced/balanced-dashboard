Balanced.AddFundsModalView = Balanced.BaseFormView.extend({
    templateName: 'modals/add_funds',

    formProperties: ['source_uri'],

    dollar_amount: null,

    selected_bank_account: function () {
        if(this.get('model.source_uri')) {
            return Balanced.BankAccount.find(this.get('model.source_uri'));
        }
    }.property('model.source_uri'),

    open: function () {
        var verified_bank_accounts = this.get('marketplace.owner_customer.verified_bank_accounts');
        var source_uri = (typeof verified_bank_accounts !== "undefined" && verified_bank_accounts.length > 0) ? verified_bank_accounts[0].get('uri') : null;

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
        var self = this;
        var debit = this.get('model');

        ////
        // Convert dollars to cents
        ////
        debit.set('amount', parseInt(this.get('dollar_amount') * 100, 10));

        debit.one('didCreate', function () {
            self.get('marketplace').refresh();
            $('#add-funds').modal('hide');
        });

        debit.on('becameInvalid', function (json) {
            self.highlightErrorsFromAPIResponse(json);
        });

        debit.create();
    }
});
