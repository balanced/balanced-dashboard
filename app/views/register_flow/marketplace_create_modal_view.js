var Save = Balanced.Modals.ObjectValidateAndSaveMixin;

Balanced.MarketplaceCreateModalView = Balanced.RegisterFlowBaseModal.extend(Save, {
	templateName: "register_flow/marketplace_create_modal",
	title: "Register for a production marketplace",
	subtitle: "Step 2 of 3: Provide marketplace information",
	submitButtonText: "Continue",
	confirmMessage: "You have not completed the registration process. You will have to resubmit information from Step 1 if you cancel now.",

	errorMessages: function() {
		return Balanced.ErrorMessagesCollection.create();
	}.property(),

	isSaving: false,
	makeSaving: function() {
		this.getModalNotificationController().alertWarning("Saving...", {
			name: "Saving"
		});
		this.set("isSaving", true);
		this.$(":input").attr("disabled", true);
	},

	unmakeSaving: function() {
		this.getModalNotificationController().clearNamedAlert("Saving");
		this.set("isSaving", false);

		if (this.get("element")) {
			this.$(":input").attr("disabled", false);
		}
	},

	execute: function(callback) {
		var errors = this.get("errorMessages");
		errors.clear();

		return callback()
			.then(function(response) {
				return Ember.RSVP.resolve(response);
			}, function(response) {
				errors.populate(response);
				return Ember.RSVP.reject();
			});
	},

	actions: {
		nextStep: function(marketplace) {
			this.openNext(Balanced.MarketplaceBankAccountCreateModalView, {
				marketplace: marketplace
			});

			var apiKeySecret = this.get('model.apiKeySecret');
			var message = 'Marketplace created. API key: <span class="sl-sb">%@</span>';
			var controller = this.getModalNotificationController();
			controller.alertSuccess(new Ember.Handlebars.SafeString(message.fmt(apiKeySecret)));

		},

		save: function() {
			var self = this;
			var model = this.get("model");
			this.makeSaving();

			this.save(model)
				.then(function(marketplaceUri) {
					var userMarketplace = Balanced.UserMarketplace.create({
						secret: model.get("apiKeySecret"),
						uri: Balanced.Auth.get("user.api_keys_uri")
					});

					self
						.execute(function() {
							return userMarketplace.save();
						})
						.then(function() {
							Balanced.Auth.setAPIKey(model.get("apiKeySecret"));
						})
						.then(function() {
							return Balanced.Auth.get("user").reload();
						})
						.then(function() {
							return Balanced.Marketplace.find(marketplaceUri);
						})
						.then(function(marketplace) {
							self.unmakeSaving();
							self.send("nextStep", marketplace);
						});
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
		});
		return this.create({
			model: model
		});
	}
});
