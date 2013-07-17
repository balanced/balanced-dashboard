Balanced.AddBankAccountModalView = Balanced.View.extend({
    templateName: 'modals/add_bank_account',

    isSubmitting: false,

    open: function () {
        this.set('isSubmitting', false);
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
        if(this.get('isSubmitting')) {
            return;
        }
        this.set('isSubmitting', true);

        var self = this;
        var bankAccount = this.get('model');

        // this isn't an ember widget, so have to grab it ourselves
        bankAccount.set('type', this.$('form input[name=account_type]').val());

        bankAccount.create().then(function() {
            Balanced.Verification.create({
                uri: bankAccount.get('verifications_uri')
            }).create().then(function() {
                self.get('customer.bank_accounts').refresh();
                $('#add-bank-account').modal('hide');
                self.set('isSubmitting', false);
            }, function() {
                self.set('isSubmitting', false);
            });
        }, function() {
            self.set('isSubmitting', false);
        });
    }
});
