Balanced.UserReloadIntermediateStateModalView = Balanced.IntermediateStateBaseModalView.extend({
	message: "Reloading user",

	actions: {
		nextStep: function() {
			var href = this.get("marketplaceHref");
			this.openNext(Balanced.MarketplaceFindIntermediateStateModalView, {
				marketplaceHref: href
			});
		},
		save: function() {
			var self = this;

			this
				.execute(function() {
					return Balanced.Auth.get("user").reload();
				})
				.then(function() {
					self.send("nextStep");
				});
		}
	}
});
