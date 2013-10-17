Balanced.ActivityRoute = Balanced.AuthRoute.extend({});

Balanced.ActivityIndexRoute = Balanced.AuthRoute.extend({
	redirect: function() {
		this.transitionTo('activity.transactions', this.modelFor('marketplace'));
	}
});

Balanced.ActivityTransactionsRoute = Balanced.AuthRoute.extend({
	pageTitle: 'Activity',

	setupController: function(controller, model) {
		this._super(controller, model);

		if (this.controllerFor('activity').get('category') !== 'transaction') {
			this.controllerFor('activity').set('type', 'transaction');
		} else {
			this.controllerFor('activity').send('reload');
		}
	}
});

Balanced.ActivityCustomersRoute = Balanced.AuthRoute.extend({
	pageTitle: 'Activity',

	setupController: function(controller, model) {
		this._super(controller, model);

		if (this.controllerFor('activity').get('category') !== 'account') {
			this.controllerFor('activity').set('type', 'account');
		} else {
			this.controllerFor('activity').send('reload');
		}
	}
});

Balanced.ActivityFundingInstrumentsRoute = Balanced.AuthRoute.extend({
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
