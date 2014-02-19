Balanced.CreditBankAccountModalView = Balanced.View.extend({
	templateName: 'modals/credit_bank_account',

	dollar_amount: null,

	didInsertElement: function() {
		this.get('controller').on('openCreditBankAccountModal', this, this.open);
		this._super();
	},

	willDestroyElement: function() {
		this.get('controller').off('openCreditBankAccountModal', this, this.open);
		this._super();
	},

	open: function() {
		var credit = Balanced.Credit.create({
			uri: this.get('funding_instrument.credits_uri'),
			bank_account_uri: this.get('funding_instrument.uri'),
			amount: null
		});

		this.set('dollar_amount', null);
		this.set('model', credit);

		$('#credit-bank-account').modal({
			manager: this.$()
		});
	},

	actions: {
		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			var credit = this.get('model');

			var cents = null;
			try {
				cents = Balanced.Utils.dollarsToCents(this.get('dollar_amount'));
			} catch (error) {
				credit.set('validationErrors', {
					'amount': error
				});
				return;
			}
			credit.set('amount', cents);

			var self = this;
			credit.save().then(function(credit) {
				$('#credit-bank-account').modal('hide');
				self.get('controller').transitionToRoute('credits', credit);
			});
		}
	}
});
