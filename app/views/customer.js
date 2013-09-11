Balanced.CustomersView = Balanced.View.extend({
    openDebitCustomerModal: function () {
        this.get('debitCustomerModal').open();
    },

    openCreditCustomerModal: function () {
        this.get('creditCustomerModal').open();
    },

    openAddBankAccountModal: function () {
        this.get('addBankAccountModal').open();
    },

    openAddCardModal: function () {
        this.get('addCardModal').open();
    }
});
