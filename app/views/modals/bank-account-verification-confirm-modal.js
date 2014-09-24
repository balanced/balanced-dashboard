import Computed from "balanced-dashboard/utils/computed";
import ModalBaseView from "./modal-base";
import Save from "balanced-dashboard/views/modals/mixins/object-action-mixin";
import Wide from "balanced-dashboard/views/modals/mixins/wide-modal-mixin";

var BankAccountVerificationConfirmModalView = ModalBaseView.extend(Wide, Save, {
	templateName: 'modals/bank-account-verification-confirm-modal',
	elementId: 'confirm-verification',
	title: "Confirm your bank account",

	failedConfirmation: false,
	verification: Ember.computed.oneWay("bankAccount.verification"),

	errorSaving: function(error) {
		var verification = this.get('verification');
		if (verification.get('errorCategoryCode') === "bank-account-authentication-failed") {
			this.set('failedConfirmation', true);
		}
		verification.reload();
	},

	amount_1_highlight: Computed.orProperties('failedConfirmation', 'model.validationErrors.amount_1'),
	amount_2_highlight: Computed.orProperties('failedConfirmation', 'model.validationErrors.amount_2'),
	actions: {
		save: function() {
			var self = this;
			var verification = this.get("verification");
			var bankAccount = this.get("bankAccount");

			this.save(verification)
				.then(function() {
					bankAccount.reload();
				}, function(errors) {
					self.setProperties({
						failedConfirmation: true,
						isSaving: false
					});
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
