Balanced.MarketplacesController = Balanced.ArrayController.extend({
	needs: ['marketplace', 'application', 'marketplaces'],
	marketplace: Ember.computed.oneWay('controllers.marketplace'),
	isApplyPage: Ember.computed.equal('controllers.application.currentRouteName', 'marketplaces.apply')
});
