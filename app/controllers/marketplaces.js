Balanced.MarketplacesController = Balanced.ArrayController.extend({
	needs: ['marketplace', 'application', 'marketplaces'],
	marketplaceBinding: 'controllers.marketplace',
	actions: {
		expand: function() {
			this.transitionToRoute('activity.transactions');
		}
	}
});
