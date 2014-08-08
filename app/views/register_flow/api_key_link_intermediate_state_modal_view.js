var Save = Balanced.Modals.ObjectSaveMixin;

Balanced.ApiKeyLinkIntermediateStateModalView = Balanced.IntermediateStateBaseModalView.extend(Save, {
	message: function() {
		return "%@ - %@".fmt(this.get("marketplaceHref"), this.get("apiKeySecret"));
	}.property("marketplaceHref", "apiKeySecret"),

	apiKeySecret: Ember.computed.oneWay("model.secret"),

	actions: {
		nextStep: function() {
			var controller = this.get("container").lookup("controller:application");
			var marketplaceHref = this.get("marketplaceHref");
			controller.send("openModal", Balanced.UserReloadIntermediateStateModalView, marketplaceHref);
		},
		save: function() {
			var self = this;
			var errors = this.get("errorMessages");
			errors.clear();

			this.save(this.get("model"))
				.then(function() {
					return Ember.run(function() {
						Balanced.Auth.setAPIKey(self.get("apiKeySecret"));
					});
				})
				.then(function() {
					self.send("nextStep");
				})
				.then(undefined, function(response) {
					errors.populate(response);
				});
		}
	}
});

Balanced.ApiKeyLinkIntermediateStateModalView.reopenClass({
	open: function(userMarketplace, marketplaceHref) {
		var view = this.create({
			model: userMarketplace,
			marketplaceHref: marketplaceHref
		});
		view.send("save");
		return view;
	}
});
