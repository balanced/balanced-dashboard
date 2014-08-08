Balanced.ApiKeyLinkIntermediateStateModalView = Balanced.IntermediateStateBaseModalView.extend({
	message: function() {
		return "%@ - %@".fmt(this.get("marketplaceHref"), this.get("apiKeySecret"));
	}.property("marketplaceHref", "apiKeySecret"),

	apiKeySecret: Ember.computed.oneWay("model.secret"),

	actions: {
		nextStep: function() {
			var marketplaceHref = this.get("marketplaceHref");
			this.openNext(Balanced.UserReloadIntermediateStateModalView, marketplaceHref);
		},

		save: function() {
			var self = this;
			var model = this.get("model");

			this
				.execute(function() {
					return model.save();
				})
				.then(function() {
					return Ember.run(function() {
						Balanced.Auth.setAPIKey(self.get("apiKeySecret"));
					});
				})
				.then(function() {
					self.send("nextStep");
				})
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
