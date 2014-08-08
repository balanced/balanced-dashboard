var Full = Balanced.Modals.FullModalMixin;
var Save = Balanced.Modals.ObjectValidateAndSaveMixin;

Balanced.MarketplaceCreateModalView = Balanced.ModalBaseView.extend(Full, Save, {
	templateName: "register_flow/marketplace_create_modal",
	title: "Create marketplace",

	actions: {
		save: function() {
			var self = this;
			var controller = this.get("controller");
			var model = this.get("model");
			var apiKeySecret = model.get("apiKeySecret");
			this.save(model)
				.then(function(href) {
					controller.send("openModal", Balanced.ApiKeyLinkIntermediateStateModalView, href, apiKeySecret);
				});
		}
	}
});

Balanced.MarketplaceCreateModalView.reopenClass({
	open: function(apiKeySecret) {
		console.log(apiKeySecret);
		var model = Balanced.MarketplaceFactory.create({
			name: "startupl.io",
			domain_url: "startupl.io",
			support_email_address: "carlosrr@gmail.com",
			support_phone_number: "111.2222",
			apiKeySecret: apiKeySecret
		})
		return this.create({
			model: model
		});
	}
});
