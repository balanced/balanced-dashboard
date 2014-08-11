Balanced.ClaimRoute = Balanced.Route.extend({
	model: function() {
		var claim = Balanced.Claim.create();

		return {
			claim: claim
		};
	},

	setupController: function(controller, model) {
		this._super(controller, model.claim);
	},

	redirect: function() {
		if (!this.get("auth").isUnregistered()) {
			this.transitionTo('index');
		}
	},

	actions: {
		cancel: function() {
			this.transitionTo('index');
		}
	}
});
