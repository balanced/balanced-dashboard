require('app/components/modal');

Balanced.AddFundsModalComponent = Balanced.ModalComponent.extend({
	submitAction: 'submitDebitCustomer',
	dollar_amount: null,

	source: function() {
		if (!this.get('model')) {
			return null;
		}

		var debitableBankAccounts = this.get('debitable_bank_accounts');
		var sourceUri = this.get('model.source_uri');
		var defaultSource = null;
		if (debitableBankAccounts && debitableBankAccounts.get('length') > 0) {
			defaultSource = (debitableBankAccounts.get('content') || debitableBankAccounts)[0];
		}
		return debitableBankAccounts.find(function(source) {
			if (source) {
				return sourceUri === source.get('uri');
			}
		}) || defaultSource;
	}.property('model', 'model.source_uri', 'debitable_bank_accounts'),

	debitable_bank_accounts: function() {
		return this.get('marketplace.owner_customer.debitable_bank_accounts');
	}.property('marketplace.owner_customer.debitable_bank_accounts'),

	actions: {
		open: function() {
			var debit = Balanced.Debit.create({
				amount: null,
				description: null
			});

			this.set('dollar_amount', null);

			this._super(debit);
		},

		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			var self = this;
			var debit = this.get('model');
			var source = this.get('source');
			var cents = null;

			if (!source) {
				return;
			}

			try {
				cents = Balanced.Utils.dollarsToCents(this.get('dollar_amount'));
			} catch (error) {
				debit.set('validationErrors', {
					'amount': error
				});
				return;
			}

			debit.set('uri', source.get('debits_uri'));
			debit.set('amount', cents);
			debit.on('didCreate', function() {
				self.get('marketplace').reload();
				self.hide();
			});

			this._super(debit);
		}
	}
});
