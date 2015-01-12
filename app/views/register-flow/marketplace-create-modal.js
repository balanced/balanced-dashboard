import RegisterFlowBaseModalView from "./register-flow-base-modal";
import MarketplaceFactory from "balanced-dashboard/models/factories/marketplace-factory";
import MarketplaceBankAccountCreateModalView from "./marketplace-bank-account-create-modal";
import Auth from "balanced-dashboard/auth";
import ErrorsLogger from "balanced-dashboard/lib/errors-logger";

var MarketplaceCreateModalView = RegisterFlowBaseModalView.extend({
	templateName: "register-flow/marketplace-create-modal",
	title: "Register for a production marketplace",
	subtitle: "Step 2 of 3: Provide marketplace information",
	submitButtonText: "Continue",
	confirmMessage: "You have not completed the registration process. You will have to resubmit information from Step 1 if you cancel now.",
	elementId: "marketplaceCreate",

	linkMarketplace: function(user, apiKeySecret, href) {
		var controller = this.get("container").lookup("controller:register-flow/user-marketplace");
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
		this.trackEvent("Error linking marketplace to user", {
			marketplace: marketplaceHref,
			formFields: this.get("model").getPropertiesDump()
		});
		this.close();
		this.globalAlertError("Your marketplace was created but there was an error linking it to your user account. Please contact support@balancedpayments.com");
	},

	nextStepSuccess: function(marketplace, apiKeySecret) {
		this.trackEvent("Success linking marketplace to user", {
			marketplace: marketplace.get("uri"),
			formFields: this.get("model").getPropertiesDump()
		});
		this.openNext(MarketplaceBankAccountCreateModalView, {
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
					var user = Auth.get("user");

					self.trackEvent("Marketplace created", {
						marketplace: href,
						formFields: model.getPropertiesDump()
					});

					return self.linkMarketplace(user, apiKeySecret, href);
				})
				.catch(function(error) {
					ErrorsLogger.captureMessage(error);
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

MarketplaceCreateModalView.reopenClass({
	open: function(apiKeySecret) {
		var model = MarketplaceFactory.create({
			apiKeySecret: apiKeySecret
		});
		return this.create({
			model: model
		});
	}
});

export default MarketplaceCreateModalView;
