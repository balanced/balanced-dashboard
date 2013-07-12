Balanced.CustomerView = Balanced.View.extend({
    openEditCustomerInfoModal: function () {
        this.get('editCustomerInfoModal').open();
    },

    openAddBankAccountModal: function () {
        this.get('addBankAccountModal').open();
    },

    openVerifyBankAccountModal: function (bankAccount) {
        this.get('verifyBankAccountModal').open(bankAccount);
    },

    openAddCardModal: function () {
        this.get('addCardModal').open();
    }
});