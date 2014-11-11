import Ember from "ember";

var MarketplaceSearchController = Ember.ObjectController.extend({
	actions: {
		closeSearch: function() {
			this.set("isDisplayResults", false);
		},
	}
});

export default MarketplaceSearchController;
