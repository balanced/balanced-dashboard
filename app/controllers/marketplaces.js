Balanced.MarketplacesController = Balanced.ArrayController.extend({
	needs: ['marketplace', 'application', 'marketplaces', "notification_center"],
	marketplace: Ember.computed.oneWay('controllers.marketplace'),
});
