Balanced.MarketplacesController = Balanced.ArrayController.extend({
	needs: ['marketplace', 'application', 'marketplaces'],
	marketplaceBinding: 'controllers.marketplace',
	isApplyPage: Ember.computed.equal('controllers.application.currentRouteName', 'marketplaces.apply')
});
