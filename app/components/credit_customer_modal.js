require('app/components/modal');

Balanced.CreditCustomerModalComponent = Balanced.ModalComponent.extend({
	submitAction: 'submitCreditCustomer',

	dollar_amount: null,

	actions: {
		open: function() {
			var fundingInstruments = this.get('customer.creditable_funding_instruments');
			var creditUri = (fundingInstruments && fundingInstruments.get('length') > 0) ? fundingInstruments[0].get('credits_uri') : null;

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
		var sourceUri = this.get('model.source_uri');
		if (sourceUri) {
			return this.get('customer.creditable_funding_instruments').find(function(fundingInstrument) {
				return sourceUri === fundingInstrument.get('uri');
			});
		}
		return this.get('customer.creditable_funding_instruments.0');
	}.property('model.source_uri', 'customer.creditable_funding_instruments')
});
