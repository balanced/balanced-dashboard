Balanced.Modals.VerifyBankAccountModalView = Balanced.ModalBaseView.extend({
	classNameBindings: [":wide-modal", ":modal-overflow"],
	templateName: 'modals/verify_bank_account',
	elementId: 'verify-bank-account',
	title: "Bank account verification",

	isSaving: false,
	actions: {
		save: function() {
			var self = this;
			var verification = Balanced.Verification.create({
				uri: this.get('bankAccount.bank_account_verifications_uri')
			});

			self.set("isSaving", true);
			verification
				.save()
				.then(function() {
					self.set("isSaving", false);
					self.get("bankAccount").reload();
					self.close();
				}, function() {
					self.set("isSaving", false);
				});
		}
	}
});

Balanced.Modals.VerifyBankAccountModalView.reopenClass({
	open: function(bankAccount) {
		return this.create({
			bankAccount: bankAccount
		});
	}
});
