Balanced.MarketplaceIndexView = Balanced.View.extend({
    openEditMarketplaceInfoModal: function () {
        this.get('editMarketplaceInfoModal').open();
    },

    openEditOwnerInfoModal: function () {
        this.get('editOwnerInfoModal').open();
    },

    openAddBankAccountModal: function () {
        this.get('addBankAccountModal').open();
    },

    openVerifyBankAccountModal: function (bankAccount) {
        this.get('verifyBankAccountModal').open(bankAccount);
    },

    openAddCardModal: function () {
        this.get('addCardModal').open();
    },

    openAddCallbackModal: function () {
        this.get('addCallbackModal').open();
    }
});