Balanced.ActivityRoute = Balanced.AuthRoute.extend({
	defaultSort: 'created_at',

	setupController: function(controller, model) {
		this._super(controller, model);

		var activityController = this.controllerFor('activity');
		activityController.refresh();

		var defaultSort = this.get('defaultSort');
		if (defaultSort && defaultSort !== activityController.get('sortField')) {
			activityController.set('sortField', defaultSort);
		}

		var defaultType = this.get('defaultType');
		if (!defaultType) {
			return;
		}

		if (activityController.get('category') !== defaultType) {
			activityController.set('type', defaultType);
		} else {
			activityController.send('reload');
		}
	}
});

Balanced.ActivityIndexRoute = Balanced.ActivityRoute.extend({
	redirect: function() {
		this.transitionTo('activity.transactions', this.modelFor('marketplace'));
	}
});

Balanced.ActivityOrdersRoute = Balanced.ActivityRoute.extend({
	pageTitle: 'Activity',
	defaultType: 'order'
});

Balanced.ActivityTransactionsRoute = Balanced.ActivityRoute.extend({
	pageTitle: 'Activity',
	defaultType: 'search'
});

Balanced.ActivityDisputesRoute = Balanced.ActivityRoute.extend({
	pageTitle: 'Activity',
	defaultType: 'dispute',
	defaultSort: 'initiated_at'
});

Balanced.ActivityCustomersRoute = Balanced.ActivityRoute.extend({
	pageTitle: 'Activity',
	defaultType: 'customer'
});

Balanced.ActivityFundingInstrumentsRoute = Balanced.ActivityRoute.extend({
	pageTitle: 'Activity',
	defaultType: 'funding_instrument'
});
