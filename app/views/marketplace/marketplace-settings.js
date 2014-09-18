Balanced.MarketplaceSettingsView = Balanced.View.extend({
	keySecret: false,

	actions: {
		openEditMarketplaceInfoModal: function() {
			this.get('editMarketplaceInfoModal').send('open');
		}
	}
});
