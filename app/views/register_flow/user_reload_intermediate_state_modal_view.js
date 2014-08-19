Balanced.UserReloadIntermediateStateModalView = Balanced.IntermediateStateBaseModalView.extend({
	message: "Reloading user",

	actions: {
		nextStep: function(marketplace) {
			this.openNext(Balanced.MarketplaceBankAccountCreateModalView, {
				marketplace: marketplace
			});
		},
		save: function() {
			var self = this;
			var href = this.get("marketplaceHref");

			this
				.execute(function() {
					return Balanced.Auth.get("user").reload();
				})
				.then(function() {
					return Balanced.Marketplace.find(href);
				})
				.then(function(marketplace) {
					self.send("nextStep", marketplace);
				});
		}
	}
});
