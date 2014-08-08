Balanced.MarketplaceFindIntermediateStateModalView = Balanced.IntermediateStateBaseModalView.extend({
	message: function() {
		return "Finding %@".fmt(this.get("marketplaceHref"));
	}.property("marketplaceHref"),

	actions: {
		nextStep: function(marketplace) {
			var controller = this.get("container").lookup("controller:application");
			controller
				.send("openModal", Balanced.MarketplaceBankAccountCreateModalView, marketplace);
		},
		save: function() {
			var self = this;
			var errors = this.get("errorMessages");
			errors.clear();

			return Balanced.Marketplace
				.find(this.get("marketplaceHref"))
				.then(function(marketplace) {
					self.close();
					self.send("nextStep", marketplace);
				})
				.then(undefined, function(response) {
					errors.populate(response);
				});
		}
	}
});

Balanced.MarketplaceFindIntermediateStateModalView.reopenClass({
	open: function(marketplaceHref) {
		var view = this.create({
			marketplaceHref: marketplaceHref
		});
		view.send("save");
		return view;
	}
});
