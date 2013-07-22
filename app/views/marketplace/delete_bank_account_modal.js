Balanced.DeleteBankAccountModalView = Balanced.View.extend({
    templateName: 'modals/delete_bank_account',

    didInsertElement: function () {
        this.get('controller').on('openDeleteBankAccountModal', $.proxy(this.open, this));
    },

    open: function (bankAccount) {
        this.set('model', bankAccount);
        $('#delete-bank-account').modal('show');
    },

    deleteBankAccount: function () {
        if (this.get('model.isSaving')) {
            return;
        }

        var self = this;
        this.get('model').delete().then(function () {
            $('#delete-bank-account').modal('hide');
        });
    }
});
