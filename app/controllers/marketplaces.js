Balanced.MarketplacesController = Balanced.ArrayController.extend({
	needs: ['marketplace', 'application', 'marketplaces', "temporary_alerts"],
	marketplace: Ember.computed.oneWay('controllers.marketplace'),
	isApplyPage: Ember.computed.equal('controllers.application.currentRouteName', 'marketplaces.apply')
});
