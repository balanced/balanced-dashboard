import ModalBaseView from "./modal-base";
import Full from "balanced-dashboard/views/modals/mixins/full-modal-mixin";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";
import Verification from "balanced-dashboard/models/verification";

var VerifyBankAccountModalView = ModalBaseView.extend(Full, Form, {
	templateName: 'modals/verify-bank-account',
	elementId: 'verify-bank-account',
	title: "Bank account verification",
	submitButtonText: "Start verification",

	isSaving: false,

	didInsertElement: function() {
		this.getModalNotificationController().clearAlerts();
	},

	actions: {
		save: function() {
			var self = this;
			var notification = this.getNotificationController();
			var modalNotification = this.getModalNotificationController();
			var verification = Verification.create({
				uri: this.get('bankAccount.bank_account_verifications_uri')
			});

			self.set("isSaving", true);
			verification
				.save()
				.then(function(model) {
					model.reload();
					self.set("isSaving", false);
					notification.alertSuccess("Verification started. Remember to verify your bank account once you receive your microdeposits in 1–2 business days.");
					self.get("container").lookup("controller:marketplace").updateBankAccountNotifications();
					self.close();
				}, function(response) {
					modalNotification.alertError(response.errors[0].additional);
					self.set("isSaving", false);
				});
		}
	}
});

VerifyBankAccountModalView.reopenClass({
	open: function(bankAccount) {
		return this.create({
			bankAccount: bankAccount
		});
	}
});

export default VerifyBankAccountModalView;
