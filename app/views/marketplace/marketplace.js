Balanced.MarketplaceView = Balanced.View.extend({
    openAddFundsModal: function () {
        this.get('addFundsModal').open();
    },

    openWithdrawFundsModal: function () {
        this.get('withdrawFundsModal').open();
    }
});
