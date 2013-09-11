Balanced.MarketplaceSettingsView = Balanced.View.extend({
    keySecret: false,

    openEditMarketplaceInfoModal: function () {
        this.get('editMarketplaceInfoModal').open();
    },

    openAddBankAccountModal: function () {
        this.get('addBankAccountModal').open();
    },

    openAddCardModal: function () {
        this.get('addCardModal').open();
    },

    openAddCallbackModal: function () {
        this.get('addCallbackModal').open();
    },

    showKeySecret: function() {
        this.set('keySecret', true);
    }
});
