Balanced.MarketplacesApplyRoute = Balanced.Route.extend({
	title: 'Apply for production access',

	setupController: function(controller) {
		var model = Balanced.ProductionAccessRequest.create({});

		model.set("user", this.get("user"));

		this._super(controller, model);
		this.controllerFor('marketplace').set('content', null);
	},
});
