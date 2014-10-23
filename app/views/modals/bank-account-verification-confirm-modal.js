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
		return "Verification: %@ attempts left".fmt(this.get("verification.attempts_remaining"));
	}.property("verification.attempts_remaining"),

	failedConfirmation: false,
	verification: Ember.computed.oneWay("bankAccount.verification"),

	errorSaving: function(error) {
		var verification = this.get('verification');
		if (verification.get('errorCategoryCode') === "bank-account-authentication-failed") {
			this.set('failedConfirmation', true);
		}
		verification.reload();
	},

	actions: {
		save: function() {
			var self = this;
			var verification = this.get("verification");
			var bankAccount = this.get("bankAccount");

			var notification = this.getNotificationController();
			var modalNotification = this.getModalNotificationController();

			verification.get("validationErrors").clear();
			modalNotification.clearAlerts();

			this.save(verification)
				.then(function() {
					verification.reload();
					notification.alertSuccess("Bank account verified");
				}, function(errors) {
					verification.reload();

					if (verification.get("verification_status") === "failed") {
						self.close();
						notification.alertError("Verification failed. You may restart the verification process after three business days.");
						return Ember.RSVP.reject();
					}

					var globalMessages = verification.get("validationErrors.messages");
					if (globalMessages.get("length") > 0) {
						globalMessages.forEach(function(message) {
							modalNotification.alertError(message);
						});
					} else {
						modalNotification.alertError("Please fix the errors below.");
					}

					return Ember.RSVP.reject();
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
