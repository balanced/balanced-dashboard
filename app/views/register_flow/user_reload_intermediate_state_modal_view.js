Balanced.UserReloadIntermediateStateModalView = Balanced.IntermediateStateBaseModalView.extend({
	message: "Reloading user",

	actions: {
		nextStep: function() {
			var href = this.get("marketplaceHref");
			var controller = this.get("container").lookup("controller:application");
			controller
				.send("openModal", Balanced.MarketplaceFindIntermediateStateModalView, href);
		},
		save: function() {
			var self = this;
			var errors = this.get("errorMessages");
			errors.clear();

			return Balanced.Auth.get("user")
				.reload()
				.then(function() {
					self.close();
					self.send("nextStep");
				})
				.then(undefined, function(response) {
					errors.populate(response);
				});
		}
	}
});

Balanced.UserReloadIntermediateStateModalView.reopenClass({
	open: function(marketplaceHref) {
		var view = this.create({
			marketplaceHref: marketplaceHref
		});
		view.send("save");
		return view;
	}
});
