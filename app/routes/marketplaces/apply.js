import Ember from "ember";

var MarketplacesApplyRoute = Ember.Route.extend({
	beforeModel: function(transition) {
		transition.abort();

		if (transition.sequence > 0) {
			this.send("openModal", "modals/marketplace-application-create");
		} else {
			var self = this;
			this.transitionTo("marketplaces.index")
				.then(function(r) {
					return Ember.run.next(function() {
						self.transitionTo("marketplaces.apply");
					});
				});
		}
	},
});

export default MarketplacesApplyRoute;
