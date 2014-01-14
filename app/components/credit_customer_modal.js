require('app/components/modal');

Balanced.CreditCustomerModalComponent = Balanced.ModalComponent.extend({
	submitAction: 'submitCreditCustomer',

	dollar_amount: null,

	actions: {
		open: function() {
			var bankAccounts = this.get('customer.bank_accounts');
			var creditUri = (bankAccounts && bankAccounts.get('length') > 0) ? bankAccounts.get('content')[0].get('credits_uri') : null;

			var credit = Balanced.Credit.create({
				uri: creditUri,
				amount: null,
				order: this.get('order.href')
			});

			this.set('dollar_amount', null);

			this._super(credit);
		},

		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			var credit = this.get('model');
			var selfie = this.get('selected_funding_instrument');
			if (selfie) {
				credit.set('uri', selfie.get('credits_uri'));
			}

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

			this._super(credit);
		}
	},

	selected_funding_instrument: function() {
		var bankAccountUri = this.get('model.bank_account_uri');
		if (bankAccountUri) {
			return this.get('customer.bank_accounts').find(function(bankAccount) {
				return bankAccountUri === bankAccount.get('uri');
			});
		}
		return this.get('customer.creditable_funding_instruments.0');
	}.property('model.bank_account_uri', 'customer.bank_accounts')
});
