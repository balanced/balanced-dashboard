import ModalBaseView from "./modal-base";
import Verification from "balanced-dashboard/models/verification";

var VerifyBankAccountModalView = ModalBaseView.extend({
	classNameBindings: [":wide-modal", ":modal-overflow"],
	templateName: 'modals/verify-bank-account',
	elementId: 'verify-bank-account',
	title: "Bank account verification",

	isSaving: false,

	actions: {
		save: function() {
			var self = this;
			var controller = this.get("container").lookup("controller:modal-notification-center");
			var verification = Verification.create({
				uri: this.get('bankAccount.bank_account_verifications_uri')
			});

			self.set("isSaving", true);
			verification
				.save()
				.then(function() {
					self.set("isSaving", false);
					self.get("bankAccount").reload();
					self.get("container").lookup("controller:marketplace").updateBankAccountNotifications();
					self.close();
				}, function(response) {
					controller.alertError(response.errors[0].additional);
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
