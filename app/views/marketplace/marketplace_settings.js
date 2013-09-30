Balanced.MarketplaceSettingsView = Balanced.View.extend({
	keySecret: false,

	actions: {
		openEditMarketplaceInfoModal: function() {
			this.get('editMarketplaceInfoModal').send('open');
		},

		openAddBankAccountModal: function() {
			this.get('addBankAccountModal').send('open');
		},

		openAddCardModal: function() {
			this.get('addCardModal').send('open');
		},

		openAddCallbackModal: function() {
			this.get('addCallbackModal').send('open');
		},

		showKeySecret: function() {
			this.set('keySecret', true);
		}
	}
});
