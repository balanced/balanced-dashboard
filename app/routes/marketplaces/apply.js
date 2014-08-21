Balanced.MarketplacesApplyRoute = Balanced.Route.extend({
	beforeModel: function(transition) {
		transition.abort();

		if (transition.sequence > 0) {
			this.send("openModal", Balanced.ApiKeyCreateModalView);
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
