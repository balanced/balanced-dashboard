Balanced.FundingInstrumentsIndexRoute = Balanced.AuthRoute.extend({
	pageTitle: 'Payment methods',

	setupController: function(controller, model) {
		this._super(controller, model);
		controller.send('reload');
	}
});
