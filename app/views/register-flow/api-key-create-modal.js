import RegisterFlowBaseModalView from "./register-flow-base-modal";
import Constants from "balanced-dashboard/utils/constants";
import ApiKeyFactory from "balanced-dashboard/models/factories/api-key";
import ErrorsLogger from "balanced-dashboard/lib/errors-logger";

var ERROR_MESSAGES = {
	"person-kyc": "We could not verify your identity. Please check your information again and resubmit.",
	"business-principal-kyc": "We could not verify your identity. Please check your information again and resubmit.",
	"business-kyc": "We could not verify your business. Please check your information again and resubmit.",
	"marketplace-already-created": "A marketplace has already been created with this information. If you cannot access it please contact support at support@balancedpayments.com"
};

var getApiErrorFor10 = function(response) {
	return ERROR_MESSAGES[response.category_code] || response.description;
};
var isApiErrorFor10 = function(response) {
	return !Ember.isBlank(response.category_code);
};

var ApiKeyCreateModalView = RegisterFlowBaseModalView.extend({
	templateName: "register-flow/api-key-create-modal",
	title: "Register for a production marketplace",
	subtitle: "Step 1 of 3: Provide business information",
	submitButtonText: "Continue",
	confirmMessage: "You have not completed the registration process. You will have to resubmit information if you cancel now.",
	elementId: "apiKeyCreate",

	apiKeyTypes: [{
		value: "person",
		label: "Individual"
	}, {
		value: "business",
		label: "Business"
	}],

	businessTypes: Constants.COMPANY_TYPES,

	model: function() {
		return ApiKeyFactory.create({
			merchant: {
				type: "person",
				phone_number: "",
				postal_code: ""
			},
			business: {
				company_type: "llc",
				name: "",
				incorporation_date: "",
				tax_id: ""
			},
			person: {
				name: "",
				ssn_last_4: "",
				dob: "",
				postal_code: ""
			},
		});
	}.property(),

	nextStepSuccess: function(apiKeySecret) {
		var MarketplaceCreateModalView = this.get("container").lookupFactory("view:marketplace-create-modal");
		this.trackEvent("User created api key", {
			formFields: this.get("model").getPropertiesDump()
		});
		this.openNext("register-flow/marketplace-create-modal", apiKeySecret);
		this.alertSuccess("Business information confirmed");
	},

	alertServerError: function(response) {
		if (!this.get("model.isValid")) {
			return;
		}

		var message = "There was an unknown error creating your marketplace. Please contact support at support@balancedpayments.com";

		if (isApiErrorFor10(response)) {
			message = getApiErrorFor10(response);
		}

		this.alertError(message);
	},

	actions: {
		save: function() {
			var self = this;
			var model = this.get("model");
			this.makeSaving();
			this.trackEvent("User saving api key", {
				formFields: model.getPropertiesDump()
			});
			model.save()
				.then(function(apiKeySecret) {
					self.nextStepSuccess(apiKeySecret);
				})
				.catch(function(error) {
					ErrorsLogger.captureMessage(error);
					self.trackEvent("Error creating apiKey", {
						error: error,
						formFields: model.getPropertiesDump()
					});
					self.alertServerError(error);
				})
				.finally(function() {
					self.unmakeSaving();
				});
		}
	}
});

export default ApiKeyCreateModalView;
