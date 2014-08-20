Balanced.MarketplaceCreateModalView = Balanced.RegisterFlowBaseModal.extend({
	templateName: "register_flow/marketplace_create_modal",
	title: "Register for a production marketplace",
	subtitle: "Step 2 of 3: Provide marketplace information",
	submitButtonText: "Continue",
	confirmMessage: "You have not completed the registration process. You will have to resubmit information from Step 1 if you cancel now.",

	linkMarketplace: function(user, apiKeySecret, href) {
		var controller = this.get("container").lookup("controller:user_marketplace");
		var self = this;
		return controller
			.pushMarketplace(user, apiKeySecret, href)
			.then(function(marketplace) {
				self.nextStepSuccess(marketplace, apiKeySecret);
			}, function() {
				self.nextStepFailure(href);
			});
	},

	nextStepFailure: function(marketplaceHref) {
		Balanced.Analytics.trackEvent("Error linking marketplace to user", {
			marketplace: marketplaceHref,
			formFields: this.get("model").getPropertiesDump()
		});
		this.close();
		this.globalAlertError("Your marketplace was created but there was an error linking it to your user account. Please contact support@balancedpayments.com");
	},

	nextStepSuccess: function(marketplace, apiKeySecret) {
		Balanced.Analytics.trackEvent("Success linking marketplace to user", {
			marketplace: marketplace.get("uri"),
			formFields: this.get("model").getPropertiesDump()
		});
		this.openNext(Balanced.MarketplaceBankAccountCreateModalView, {
			marketplace: marketplace
		});
		this.alertSuccess('Marketplace created. API key: <span class="sl-sb">%@</span>'.fmt(apiKeySecret));
	},

	actions: {
		save: function() {
			var self = this;
			var model = this.get("model");

			this.makeSaving();
			self.trackEvent("User creating marketplace", {
				formFields: model.getPropertiesDump()
			});
			model.save()
				.then(function(href) {
					var apiKeySecret = self.get("model.apiKeySecret");
					var user = Balanced.Auth.get("user");

					self.trackEvent("Marketplace created", {
						marketplace: href,
						formFields: model.getPropertiesDump()
					});

					return self.linkMarketplace(user, apiKeySecret, href);
				})
				.catch(function(error) {
					self.trackEvent("Error creating marketplace", {
						error: error,
						formFields: model.getPropertiesDump()
					});
				})
				.finally(function() {
					self.unmakeSaving();
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
