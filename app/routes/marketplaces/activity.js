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

Balanced.ActivityOrdersRoute = Balanced.ActivityRoute.extend({
	pageTitle: 'Activity',
	defaultType: 'order'
});

Balanced.ActivityTransactionsRoute = Balanced.ActivityRoute.extend({
	pageTitle: 'Activity',
	defaultType: 'transaction'
});

Balanced.ActivityIndexRoute = Balanced.RedirectRoute('activity.transactions');
Balanced.ActivityCustomersRoute = Balanced.RedirectRoute('marketplace.customers');
Balanced.ActivityFundingInstrumentsRoute = Balanced.RedirectRoute('marketplace.funding_instruments');
Balanced.ActivityDisputesRoute = Balanced.RedirectRoute('marketplace.disputes');
