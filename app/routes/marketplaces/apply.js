import Ember from "ember";

var MarketplacesApplyRoute = Ember.Route.extend({
	beforeModel: function(transition) {
		transition.abort();

		if (transition.sequence > 0) {
			var ApiKeyCreateModalView = this.container.lookupFactory("view:api-key-create-modal");
			this.send("openModal", ApiKeyCreateModalView);
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
