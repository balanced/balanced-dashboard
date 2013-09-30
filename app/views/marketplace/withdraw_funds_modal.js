Balanced.WithdrawFundsModalView = Balanced.View.extend({
	templateName: 'modals/withdraw_funds',

	dollar_amount: null,

	actions: {
		open: function() {
			var self = this;
			this.get('marketplace.owner_customer.bank_accounts').then(function(bank_accounts) {
				var sourceUri = (bank_accounts && bank_accounts.get('content').length > 0) ? bank_accounts.get('content')[0].get('uri') : null;

				var credit = Balanced.Credit.create({
					uri: self.get('marketplace.owner_customer.credits_uri'),
					source_uri: sourceUri,
					amount: null,
					description: null
				});

				self.set('dollar_amount', null);
				self.set('model', credit);

				$('#withdraw-funds').modal({
					manager: self.$()
				});
			});
		},

		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			var self = this;
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

			credit.save().then(function() {
				self.get('marketplace').reload();
				$('#withdraw-funds').modal('hide');
				self.get('controller').transitionToRoute('credits', credit);
			});
		}
	},

	selected_bank_account: function() {
		if (this.get('model.source_uri')) {
			var self = this;
			return this.get('bank_accounts').find(function(b) {
				return self.get('model.source_uri') === b.get('uri');
			});
		}
	}.property('model.source_uri', 'bank_accounts'),

	bank_accounts: function() {
		return this.get('marketplace.owner_customer.bank_accounts');
	}.property('marketplace.owner_customer.bank_accounts')
});
