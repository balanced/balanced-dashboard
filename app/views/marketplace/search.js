var MarketplaceSearchView = Ember.View.extend({
	searchController: function() {
		return this.container.lookup("controller:marketplace/search");
	}.property(),

	query: Ember.computed.alias("searchController.query")
});

export default MarketplaceSearchView;
