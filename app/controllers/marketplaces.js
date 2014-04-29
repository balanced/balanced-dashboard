Balanced.MarketplacesController = Balanced.ArrayController.extend(Ember.Evented, {
	needs: ['marketplace', 'application', 'marketplaces'],
	marketplaceBinding: 'controllers.marketplace',
	actions: {
		expand: function(tabName) {
			$('.submenu.' + tabName).prev().addClass('active');
			$('.submenu.' + tabName).addClass('selected');
			this.transitionToRoute('activity.transactions');

		}
	}
});
