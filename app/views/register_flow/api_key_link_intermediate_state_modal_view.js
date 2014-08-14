Balanced.ApiKeyLinkIntermediateStateModalView = Balanced.IntermediateStateBaseModalView.extend({
	message: function() {
		return "%@ - %@".fmt(this.get("marketplaceHref"), this.get("apiKeySecret"));
	}.property("marketplaceHref", "apiKeySecret"),

	apiKeySecret: Ember.computed.oneWay("model.secret"),

	actions: {
		nextStep: function() {
			var marketplaceHref = this.get("marketplaceHref");
			this.openNext(Balanced.UserReloadIntermediateStateModalView, {
				marketplaceHref: marketplaceHref
			});

			var apiKeySecret = this.get('apiKeySecret');
			var message = 'Marketplace created. API key: <span class="sl-sb">%@</span>';
			var controller = this.getNotificationController();
			controller.alertSuccess(new Ember.Handlebars.SafeString(message.fmt(apiKeySecret)));
		},

		save: function() {
			var self = this;
			var model = this.get("model");

			this
				.execute(function() {
					return model.save();
				})
				.then(function() {
					Balanced.Auth.setAPIKey(self.get("apiKeySecret"));
					self.send("nextStep");
				});
		}
	}
});
