Balanced.WithdrawFundsModalView = Balanced.View.extend({
	templateName: 'modals/withdraw_funds',

	dollar_amount: null,

	actions: {
		open: function() {
			var self = this;
			var credit = Balanced.Credit.create({
				amount: null,
				description: null
			});

			self.set('dollar_amount', null);
			self.set('model', credit);

			$('#withdraw-funds').modal({
				manager: self.$()
			});
		},

		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			var self = this;
			var credit = this.get('model');
			var cents = null;
			var destination = this.get('destination');

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

			credit.save().then(function() {
				self.get('marketplace').reload();
				$('#withdraw-funds').modal('hide');
				self.get('controller').transitionToRoute('credits', credit);
			});
		}
	},

	destination: function() {
		var fundingInstruments = this.get('bank_accounts');
		var destinationUri = this.get('model.destination_uri');
		var defaultDestination = (fundingInstruments && fundingInstruments.get('length') > 0) ? fundingInstruments.get('content')[0] : null;
		return fundingInstruments.find(function(destination) {
			if (destination) {
				return destinationUri === destination.get('uri');
			}
		}) || defaultDestination;
	}.property('model.destination_uri', 'bank_accounts'),

	bank_accounts: function() {
		return this.get('marketplace.owner_customer.bank_accounts');
	}.property('marketplace.owner_customer.bank_accounts')
});
