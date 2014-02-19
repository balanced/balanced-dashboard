Balanced.ActivityRoute = Balanced.AuthRoute.extend({
	setupController: function(controller, model) {
		if (controller && controller.refresh) {
			controller.refresh();
		}

		this._super(controller, model);
	}
});

Balanced.ActivityIndexRoute = Balanced.ActivityRoute.extend({
	redirect: function() {
		this.transitionTo('activity.transactions', this.modelFor('marketplace'));
	}
});

Balanced.ActivityOrdersRoute = Balanced.ActivityRoute.extend({
	pageTitle: 'Activity',

	setupController: function(controller, model) {
		this._super(controller, model);

		if (this.controllerFor('activity').get('category') !== 'order') {
			this.controllerFor('activity').set('type', 'order');
		}
	}
});

Balanced.ActivityTransactionsRoute = Balanced.ActivityRoute.extend({
	pageTitle: 'Activity',

	setupController: function(controller, model) {
		this._super(controller, model);

		if (this.controllerFor('activity').get('category') !== 'search') {
			this.controllerFor('activity').set('type', 'search');
		} else {
			this.controllerFor('activity').send('reload');
		}
	}
});

Balanced.ActivityDisputesRoute = Balanced.ActivityRoute.extend({
	pageTitle: 'Activity',

	setupController: function(controller, model) {
		this._super(controller, model);

		if (this.controllerFor('activity').get('category') !== 'dispute') {
			this.controllerFor('activity').set('type', 'dispute');
		} else {
			this.controllerFor('activity').send('reload');
		}
	}
});

Balanced.ActivityCustomersRoute = Balanced.ActivityRoute.extend({
	pageTitle: 'Activity',

	setupController: function(controller, model) {
		this._super(controller, model);

		if (this.controllerFor('activity').get('category') !== 'customer') {
			this.controllerFor('activity').set('type', 'customer');
		} else {
			this.controllerFor('activity').send('reload');
		}
	}
});

Balanced.ActivityFundingInstrumentsRoute = Balanced.ActivityRoute.extend({
	pageTitle: 'Activity',

	setupController: function(controller, model) {
		this._super(controller, model);

		if (this.controllerFor('activity').get('category') !== 'funding_instrument') {
			this.controllerFor('activity').set('type', 'funding_instrument');
		} else {
			this.controllerFor('activity').send('reload');
		}
	}
});
