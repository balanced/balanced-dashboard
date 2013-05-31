Balanced.MarketplaceTransactionsView = Balanced.View.extend({
    openAddFundsModal: function() {
        this.get('addFundsModal').open();
    },

    openWithdrawFundsModal: function() {
        this.get('withdrawFundsModal').open();
    }
});