Balanced.AddBankAccountModalView = Balanced.View.extend({
    templateName: 'modals/add_bank_account',

    open: function () {
        var bankAccount = Balanced.BankAccount.create({
            uri: this.get('customer.bank_accounts_uri'),
            name: '',
            account_number: '',
            routing_number: '',
            type: 'checking'
        });
        this.set('model', bankAccount);
        this.$('#add-bank-account').modal('show');
        this.$('form input:radio[name=account_type][value=checking]').prop('checked', true);
    },

    save: function () {
        if (this.get('model.isSaving')) {
            return;
        }

        var self = this;
        var bankAccount = this.get('model');

        // this isn't an ember widget, so have to grab it ourselves
        bankAccount.set('type', this.$('form input[name=account_type]').val());

        bankAccount.save().then(function () {
            self.get('customer.bank_accounts').reload();
            $('#add-bank-account').modal('hide');
        });
    }
});
