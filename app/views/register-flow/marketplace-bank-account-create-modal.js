import Ember from "ember";
import RegisterFlowBaseModalView from "./register-flow-base-modal";
import Constants from "balanced-dashboard/utils/constants";
import MarketplaceBankAccountFactory from "balanced-dashboard/models/factories/marketplace-bank-account-factory";
import InitialDepositTransactionFactory from "balanced-dashboard/models/factories/initial-deposit-transaction-factory";
import ErrorsLogger from "balanced-dashboard/lib/errors-logger";

var MarketplaceBankAccountCreateModalView = RegisterFlowBaseModalView.extend({
	templateName: "register-flow/marketplace-bank-account-create-modal",
	title: "Register for a production marketplace",
	subtitle: "Step 3 of 3: Add your bank account",
	submitButtonText: "Complete registration",
	confirmMessage: "You have not completed the registration process. You will need to add and verify your bank account in order to deposit funds.",
	elementId: "marketplaceBankAccountCreate",

	accountTypes: [{
		value: "checking",
		label: "Checking"
	}, {
		value: "savings",
		label: "Savings"
	}],

	model: function() {
		return MarketplaceBankAccountFactory.create();
	}.property(),

	isInitialDepositCreate: false,
	isInitialDepositTransactionCreated: false,

	initialDepositModel: function() {
		return InitialDepositTransactionFactory.create();
	}.property(),

	expirationMonths: Constants.TIME.MONTHS,
	expirationYears: function() {
		var start = new Date().getFullYear();
		return _.times(10, function(i) {
			return start + i;
		});
	}.property(),


	validate: function(bankAccountModel, initialDepositModel) {
		var validate = function(model) {
			if (model) {
				model.validate();
				return model.get("isValid");
			}
			return true;
		};

		if (validate(bankAccountModel) && validate(initialDepositModel)) {
			return Ember.RSVP.resolve();
		} else {
			return Ember.RSVP.reject();
		}
	},

	save: function(bankAccountModel, initialDepositModel) {
		var self = this;
		return this
			.validate(bankAccountModel, initialDepositModel)
			.then(function() {
				if (initialDepositModel) {
					return initialDepositModel.save()
						.then(function(debit) {
							self.getModalNotificationController().alertSuccess("Initial deposit was made from your bank account.");
						});
				}
			})
			.then(function() {
				self.set("isInitialDepositTransactionCreated", true);
				return bankAccountModel.save();
			});
	},

	getInitialDepositModel: function() {
		return this.get("isInitialDepositCreate") ?
			this.get("initialDepositModel") : undefined;
	},


	nextStepFailure: function(marketplace, bankAccountHref, error) {
		ErrorsLogger.captureMessage(error);
		this.trackEvent("Bank account links error", {
			error: error,
			marketplace: marketplace.get("uri"),
			bankAccountHref: bankAccountHref
		});
		this.globalAlertError("Your bank account was created but there was an error linking it to your marketplace. Please contact support@balancedpayments.com");
	},
	nextStepSuccess: function(marketplace, bankAccountHref) {
		this.trackEvent("Bank account linked", {
			marketplace: marketplace.get("uri"),
			bankAccountHref: bankAccountHref
		});
		this.globalAlertSuccess("Bank account linked. Remember to verify your bank account once you receive your micro-deposits in 1–2 business days.");
	},

	linkAndVerify: function(marketplace, bankAccountHref) {
		var self = this;
		return self.get("container")
			.lookup("controller:register-flow/owner-customer-bank-account")
			.linkAndVerify(marketplace, bankAccountHref)
			.then(function(marketplace) {
				self.nextStepSuccess(marketplace, bankAccountHref);
			}, function(error) {
				self.nextStepFailure(marketplace, bankAccountHref, error);
			})
			.finally(function() {
				self.close();
				self.get("container").lookup("controller:application").transitionToRoute("marketplace", marketplace);
			});
	},

	actions: {
		save: function() {
			var self = this;
			var marketplace = this.get("marketplace");
			var model = this.get("model");

			this.makeSaving();
			self.trackEvent("User creating bank account", {
				formFields: model.getPropertiesDump(),
				isInitialDepositCreate: this.get("isInitialDepositCreate")
			});

			this.save(model, this.getInitialDepositModel())
				.then(function(bankAccountHref) {
					self.trackEvent("User created bank account", {
						formFields: model.getPropertiesDump(),
						isInitialDepositCreate: self.get("isInitialDepositCreate"),
						bankAccountHref: bankAccountHref
					});
					return self.linkAndVerify(marketplace, bankAccountHref);
				})
				.catch(function(error) {
					self.trackEvent("Error creating bank account", {
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

export default MarketplaceBankAccountCreateModalView;
