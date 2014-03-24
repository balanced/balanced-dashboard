Balanced.MarketplacesController = Balanced.ArrayController.extend(Ember.Evented, {
	needs: ['marketplace', 'application', 'marketplaces'],
	marketplaceBinding: 'controllers.marketplace'
});
