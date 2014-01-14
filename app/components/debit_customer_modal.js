require('app/components/modal');

Balanced.DebitCustomerModalComponent = Balanced.ModalComponent.extend({
	submitAction: 'submitDebitCustomer',

	dollar_amount: null,

	actions: {
		open: function() {
			var fundingInstruments = this.get('customer.debitable_funding_instruments');
			var debitUri = (fundingInstruments && fundingInstruments.length > 0) ? fundingInstruments[0].get('debits_uri') : null;

			var debit = Balanced.Debit.create({
				uri: debitUri,
				amount: null,
				order: this.get('order.href')
			});

			this.set('dollar_amount', null);
			this._super(debit);
		},

		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			var debit = this.get('model');
			var selfie = this.get('selected_funding_instrument');
			if (selfie) {
				debit.set('uri', selfie.get('debits_uri'));
			}

			var cents = null;
			try {
				cents = Balanced.Utils.dollarsToCents(this.get('dollar_amount'));
			} catch (error) {
				debit.set('validationErrors', {
					'amount': error
				});
				return;
			}
			debit.set('amount', cents);
			this._super(debit);
		}
	},

	selected_funding_instrument: function() {
		var sourceUri = this.get('model.source_uri');
		if (sourceUri) {
			return this.get('customer.debitable_funding_instruments').find(function(fundingInstrument) {
				return sourceUri === fundingInstrument.get('uri');
			});
		}
		return this.get('customer.debitable_funding_instruments.0');
	}.property('model.source_uri', 'customer.debitable_funding_instruments'),

	can_debit: function() {
		return this.get('customer.debitable_funding_instruments.length') > 0;
	}.property('customer.debitable_funding_instruments')
});
