import Computed from "balanced-dashboard/utils/computed";
import ModalBaseView from "./modal-base";
import Save from "balanced-dashboard/views/modals/mixins/object-action-mixin";
import Full from "balanced-dashboard/views/modals/mixins/full-modal-mixin";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";

var BankAccountVerificationConfirmModalView = ModalBaseView.extend(Full, Form, Save, {
	templateName: 'modals/bank-account-verification-confirm-modal',
	elementId: 'confirm-verification',
	title: "Verify this bank account",
	submitButtonText: "Verify",

	sectionTitle: function() {
		return "Verification: %@ attempts left".fmt(this.get("model.attempts_remaining"));
	}.property("model.attempts_remaining"),

	failedConfirmation: false,
	model: Ember.computed.oneWay("bankAccount.verification"),

	errorSaving: function(error) {
		var verification = this.get('verification');
		if (verification.get('errorCategoryCode') === "bank-account-authentication-failed") {
			this.set('failedConfirmation', true);
		}
		verification.reload();
	},

	onModelSaved: function(verification) {
		var notification = this.getNotificationController();

		this.get("bankAccount").reload();
		this.get("model").reload();
		notification.alertSuccess("Bank account verified");
		this.close();
	},

	onModelError: function() {
		var self = this;
		var notification = this.getNotificationController();
		var verification = this.get("model");
		return verification.reload()
			.then(function() {
				var message = "Verification failed. You may restart the verification process after three business days.";
				if (verification.get("verification_status") === "failed") {
					notification.alertError(message);
					self.close();
				}
				return Ember.RSVP.reject(verification);
			});
	},

	actions: {
		save: function() {
			var self = this;
			this.validateAndSaveModel()
				.catch(function() {
					return self.onModelError();
				});
		}
	}
});

BankAccountVerificationConfirmModalView.reopenClass({
	open: function(bankAccount) {
		return this.create({
			bankAccount: bankAccount
		});
	}
});

export default BankAccountVerificationConfirmModalView;
