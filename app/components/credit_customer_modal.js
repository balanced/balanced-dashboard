require('app/components/modal');

Balanced.CreditCustomerModalComponent = Balanced.ModalComponent.extend({
	submitAction: 'submitCreditCustomer',

	dollar_amount: null,

	actions: {
		open: function() {
			var bankAccounts = this.get('customer.bank_accounts');
			var bank_account_uri = (bankAccounts && bankAccounts.get('length') > 0) ? bankAccounts.get('content')[0].get('uri') : null;

			var credit = Balanced.Credit.create({
				uri: this.get('customer.credits_uri'),
				bank_account_uri: bank_account_uri,
				amount: null,
				order: this.get('order.href')
			});

			this.set('dollar_amount', null);
			this._super(credit);
		},

		save: function() {
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
			this._super(credit);
		}
	},

	selected_funding_instrument: function() {
		if (this.get('model.bank_account_uri')) {
			var self = this;
			return this.get('customer.bank_accounts').find(function(b) {
				return self.get('model.bank_account_uri') === b.get('uri');
			});
		}
	}.property('model.bank_account_uri', 'customer.bank_accounts')
});
