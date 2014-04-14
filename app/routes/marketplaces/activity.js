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
	defaultType: 'transaction'
});

Balanced.ActivityCustomersRoute = Balanced.ActivityRoute.extend({
	pageTitle: 'Customers',
	defaultType: 'customer',

	redirect: function() {
		this.transitionTo('customers', this.modelFor('marketplace'));
	}
});

Balanced.ActivityFundingInstrumentsRoute = Balanced.ActivityRoute.extend({
	pageTitle: 'Payment Methods',
	defaultType: 'funding_instrument',

	redirect: function() {
		this.transitionTo('funding_instruments', this.modelFor('marketplace'));
	}
});

Balanced.ActivityDisputesRoute = Balanced.ActivityRoute.extend({
	pageTitle: 'Disputes',
	defaultType: 'dispute',

	redirect: function() {
		this.transitionTo('disputes', this.modelFor('marketplace'));
	}
});
