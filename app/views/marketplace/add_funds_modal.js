Balanced.AddFundsModalView = Balanced.View.extend({
    templateName: 'modals/add_funds',

    dollar_amount: null,
    description: null,

    selected_bank_account: function () {
        if (this.get('model.source_uri')) {
            return Balanced.BankAccount.find(this.get('model.source_uri'));
        }
    }.property('model.source_uri'),

    debitable_bank_accounts: function () {
        return this.get('marketplace.owner_customer.debitable_bank_accounts');
    }.property('marketplace.owner_customer.debitable_bank_accounts'),

    open: function () {
        var debitableBankAccounts = this.get('marketplace.owner_customer.debitable_bank_accounts');
        var sourceUri = (debitableBankAccounts && debitableBankAccounts.length > 0) ? debitableBankAccounts[0].get('uri') : null;

        var debit = Balanced.Debit.create({
            uri: this.get('marketplace.owner_customer.debits_uri'),
            source_uri: sourceUri,
            amount: null,
            description: null
        });

        this.set('dollar_amount', null);
        this.set('description', null);
        this.set('model', debit);

        $('#add-funds').modal('show');
    },

    save: function () {
        if (this.get('model.isSaving')) {
            return;
        }

        var self = this;
        var debit = this.get('model');

        var cents = null;
        try {
            cents = Balanced.Utils.dollarsToCents(this.get('dollar_amount'));
        } catch (error) {
            debit.set('validationErrors', {'amount': error});
            return;
        }

        debit.set('amount', cents);
        debit.set('description', this.get('description'));

        debit.save().then(function () {
            self.get('marketplace').reload();
            self.get('controller').transitionToRoute('debits', debit);
        });
    }
});
