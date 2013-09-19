Balanced.MarketplaceView = Balanced.View.extend({
	actions: {
		openAddFundsModal: function () {
			this.get('addFundsModal').send('open');
		},

		openWithdrawFundsModal: function () {
			this.get('withdrawFundsModal').send('open');
		}
	}
});
