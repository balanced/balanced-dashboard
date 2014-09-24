import Ember from "ember";

var MarketplaceSettingsView = Ember.View.extend({
	keySecret: false,

	actions: {
		openEditMarketplaceInfoModal: function() {
			this.get('editMarketplaceInfoModal').send('open');
		}
	}
});

export default MarketplaceSettingsView;
