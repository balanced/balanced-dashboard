Balanced.AddFundsModalView = Balanced.FundingInstrumentModalView.extend({
	templateName: 'modals/add_funds',
	controllerEventName: 'openAddFundsModal',
	modalElement: '#add-funds',

	source: function() {
		if (!this.get('model') || !this.get('debitable_bank_accounts')) {
			return null;
		}

		var debitableBankAccounts = this.get('debitable_bank_accounts');
		var sourceUri = this.get('model.source_uri');
		var defaultSource = null;
		if (debitableBankAccounts && debitableBankAccounts.get('length') > 0) {
			defaultSource = (debitableBankAccounts.get('content') || debitableBankAccounts)[0];
		}

		return debitableBankAccounts.findBy('uri', sourceUri) || defaultSource;
	}.property('model', 'model.source_uri', 'debitable_bank_accounts'),

	debitable_bank_accounts: Ember.computed.readOnly('marketplace.owner_customer.debitable_bank_accounts'),

	beforeSave: function(debit) {
		var source = this.get('source');

		if (!source) {
			return false;
		}

		debit.set('uri', source.get('debits_uri'));
		return this._super(debit);
	},

	open: function() {
		var debit = Balanced.Debit.create({
			description: null,
			amount: null
		});

		this._super(debit);
	}
});
