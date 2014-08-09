var Full = Balanced.Modals.FullModalMixin;
var Save = Balanced.Modals.ObjectValidateAndSaveMixin;
var OpenNext = Balanced.Modals.OpenNextModalMixin;

Balanced.MarketplaceCreateModalView = Balanced.ModalBaseView.extend(OpenNext, Full, Save, {
	templateName: "register_flow/marketplace_create_modal",
	title: "Step 2 of 3: Provide marketplace information",

	actions: {
		nextStep: function(marketplaceUri) {
			var userMarketplace = Balanced.UserMarketplace.create({
				secret: this.get("model.apiKeySecret"),
				uri: Balanced.Auth.get("user.api_keys_uri")
			});

			this.openNext(Balanced.ApiKeyLinkIntermediateStateModalView, {
				model: userMarketplace,
				marketplaceHref: marketplaceUri
			});
		},

		save: function() {
			var self = this;
			var model = this.get("model");
			this.save(model)
				.then(function(marketplaceUri) {
					self.send("nextStep", marketplaceUri, model.get("apiKeySecret"));
				});
		}
	}
});

Balanced.MarketplaceCreateModalView.reopenClass({
	open: function(apiKeySecret) {
		var model = Balanced.MarketplaceFactory.create({
			name: "startupl.io",
			domain_url: "startupl.io",
			support_email_address: "carlosrr@gmail.com",
			support_phone_number: "1112222",
			apiKeySecret: apiKeySecret
		})
		return this.create({
			model: model
		});
	}
});
