Balanced.VerifyBankAccountModalView = Balanced.View.extend({
	templateName: 'modals/verify_bank_account',

	didInsertElement: function() {
		this.get('controller').on('openVerifyBankAccountModal', this, this.open);
	},

	willDestroyElement: function() {
		this.get('controller').off('openVerifyBankAccountModal', this, this.open);
	},

	open: function() {
		var verification = Balanced.Verification.create({
			uri: this.get('funding_instrument.bank_account_verifications_uri')
		});
		this.set('model', verification);

		$('#verify-bank-account').modal({
			manager: this.$()
		});
	},

	actions: {
		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			var verification = this.get('model');
			var after = function() {
				$('#verify-bank-account').modal('hide');
			};

			verification.save().then(after, after);
		}
	}
});
