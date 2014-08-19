Balanced.ApiKeyLinkIntermediateStateModalView = Balanced.IntermediateStateBaseModalView.extend({
	message: function() {
		return "%@ - %@".fmt(this.get("marketplaceHref"), this.get("apiKeySecret"));
	}.property("marketplaceHref", "apiKeySecret"),

	apiKeySecret: Ember.computed.oneWay("model.secret"),

	actions: {
		nextStep: function(marketplace) {
			this.openNext(Balanced.MarketplaceBankAccountCreateModalView, {
				marketplace: marketplace
			});

			var apiKeySecret = this.get('apiKeySecret');
			var message = 'Marketplace created. API key: <span class="sl-sb">%@</span>';
			var controller = this.getModalNotificationController();
			controller.alertSuccess(new Ember.Handlebars.SafeString(message.fmt(apiKeySecret)));
		},

		save: function() {
			var self = this;
			var model = this.get("model");
			var href = this.get("marketplaceHref");

			this
				.execute(function() {
					return model.save();
				})
				.then(function() {
					Balanced.Auth.setAPIKey(self.get("apiKeySecret"));
				})
				.then(function() {
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
