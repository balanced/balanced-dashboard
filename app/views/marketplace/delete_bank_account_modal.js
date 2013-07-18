Balanced.DeleteBankAccountModalView = Balanced.View.extend({
    templateName: 'modals/delete_bank_account',

    isSubmitting: false,

    didInsertElement: function () {
        this.get('controller').on('openDeleteBankAccountModal', $.proxy(this.open, this));
    },

    open: function (bankAccount) {
        this.set('isSubmitting', false);
        this.set('model', bankAccount);
        $('#delete-bank-account').modal('show');
    },

    deleteBankAccount: function () {
        if (this.get('isSubmitting')) {
            return;
        }

        var self = this;
        this.set('isSubmitting', true);
        this.get('model').delete().then(function () {
            self.set('isSubmitting', false);
            $('#delete-bank-account').modal('hide');
        }, function () {
            self.set('isSubmitting', false);
        });
    }
});
