require('app/components/modal');

Balanced.WithdrawFundsModalComponent = Balanced.ModalComponent.extend({
	submitAction: 'submitCreditCustomer',
	dollar_amount: null,

	actions: {
		open: function() {
			var self = this;
			var credit = Balanced.Credit.create({
				amount: null,
				description: null
			});

			self.set('dollar_amount', null);
			self._super(credit);
		},

		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			var self = this;
			var credit = this.get('model');
			var cents = null;
			var destination = this.get('destination');

			if (!destination) {
				return;
			}

			try {
				cents = Balanced.Utils.dollarsToCents(this.get('dollar_amount'));
			} catch (error) {
				credit.set('validationErrors', {
					'amount': error
				});
				return;
			}

			credit.set('uri', destination.get('credits_uri'));
			credit.set('amount', cents);

			credit.on('didCreate', function() {
				self.get('marketplace').reload();
				self.hide();
			});

			this._super(credit);
		}
	},

	destination: function() {
		if (!this.get('model')) {
			return null;
		}

		var fundingInstruments = this.get('bank_accounts');
		var destinationUri = this.get('model.destination_uri');
		var defaultDestination = (fundingInstruments && fundingInstruments.get('length') > 0) ? fundingInstruments.get('content')[0] : null;
		return fundingInstruments.find(function(destination) {
			if (destination) {
				return destinationUri === destination.get('uri');
			}
		}) || defaultDestination;
	}.property('model', 'model.destination_uri', 'bank_accounts'),

	bank_accounts: function() {
		return this.get('marketplace.owner_customer.bank_accounts');
	}.property('marketplace.owner_customer.bank_accounts')
});
