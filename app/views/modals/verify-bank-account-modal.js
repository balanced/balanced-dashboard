import ModalBaseView from "./modal-base";
import Full from "balanced-dashboard/views/modals/mixins/full-modal-mixin";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";
import Save from "balanced-dashboard/views/modals/mixins/object-action-mixin";

var VerifyBankAccountModalView = ModalBaseView.extend(Full, Form, Save, {
	templateName: 'modals/verify-bank-account',
	elementId: 'verify-bank-account',
	title: "Bank account verification",
	submitButtonText: "Start verification",

	isSaving: false,

	didInsertElement: function() {
		this.getModalNotificationController().clearAlerts();
	},

	model: Ember.computed("bankAccount.bank_account_verifications_uri", function() {
		var uri = this.get("bankAccount.bank_account_verifications_uri");
		var verification = this.get("container").lookup("model:verification");
		verification.set("uri", uri);
		return verification;
	}),

	onModelSaved: function() {
		var notification = this.getNotificationController();
		notification.alertSuccess("Verification started. Remember to verify your bank account once you receive your microdeposits in 1–2 business days.");
		this.get("container").lookup("controller:marketplace").updateBankAccountNotifications();
		this.get("bankAccount").reload();
		this.close();
	},

	actions: {
		save: function() {
			this.validateAndSaveModel();
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
