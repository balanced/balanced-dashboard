import Ember from "ember";
Balanced.MarketplaceSettingsView = Ember.View.extend({
	keySecret: false,

	actions: {
		openEditMarketplaceInfoModal: function() {
			this.get('editMarketplaceInfoModal').send('open');
		}
	}
});
