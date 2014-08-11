Balanced.MarketplaceFindIntermediateStateModalView = Balanced.IntermediateStateBaseModalView.extend({
	message: function() {
		return "Finding %@".fmt(this.get("marketplaceHref"));
	}.property("marketplaceHref"),

	actions: {
		nextStep: function(marketplace) {
			this.openNext(Balanced.MarketplaceBankAccountCreateModalView, {
				marketplace: marketplace
			});
		},
		save: function() {
			var self = this;

			this
				.execute(function() {
					return Balanced.Marketplace.find(self.get("marketplaceHref"));
				})
				.then(function(marketplace) {
					self.send("nextStep", marketplace);
				});
		}
	}
});
