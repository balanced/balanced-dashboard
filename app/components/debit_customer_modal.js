Balanced.DebitCustomerModalComponent = Ember.Component.extend({
	submitAction: 'submitDebitCustomer',
	classNames: ['modal-container'],

	willDestroyElement: function() {
		$('#debit-customer').modal('hide');
	},

	dollar_amount: null,

	actions: {
		open: function() {
			var fundingInstruments = this.get('customer.debitable_funding_instruments');
			var source_uri = (fundingInstruments && fundingInstruments.length > 0) ? fundingInstruments[0].get('uri') : null;

			var debit = Balanced.Debit.create({
				uri: this.get('customer.debits_uri'),
				source_uri: source_uri,
				amount: null,
				order: this.get('order.href')
			});

			debit.on('didCreate', function() {
				$('#debit-customer').modal('hide');
			});

			this.set('dollar_amount', null);
			this.set('model', debit);

			$('#debit-customer').modal({
				manager: this.$()
			});
		},

		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			var debit = this.get('model');

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

			this.sendAction('submitAction', debit);
		}
	},

	selected_funding_instrument: function() {
		if (this.get('model.source_uri')) {
			var self = this;
			return this.get('customer.debitable_funding_instruments').find(function(i) {
				return self.get('model.source_uri') === i.get('uri');
			});
		}
	}.property('model.source_uri', 'customer.debitable_funding_instruments'),

	can_debit: function() {
		return this.get('customer.debitable_funding_instruments.length') > 0;
	}.property('customer.debitable_funding_instruments')
});
