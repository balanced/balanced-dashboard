Balanced.MarketplacesIndexRoute = Balanced.Route.extend({
	pageTitle: 'Marketplaces',

	beforeModel: function() {
		var sessionsController = this.controllerFor("sessions");
		if (!sessionsController.get("isUserRegistered")) {
			this.transitionTo("setup_guest_user");
		}
	},

	setupController: function() {
		Balanced.Utils.setCurrentMarketplace(null);
		this.controllerFor('marketplace').set('content', null);
	}
});
