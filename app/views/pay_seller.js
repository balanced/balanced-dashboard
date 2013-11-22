Balanced.PaySellerModalView = Balanced.View.extend({

	templateName: 'modals/pay_seller',

	amount_dollars: 0,

	didInsertElement: function() {
		this.get('controller').on('openPaySellerModal', this, this.open);
	},

	willDestroyElement: function() {
		this.get('controller').off('openPaySellerModal', this, this.open);
	},

	open: function() {
		var credit = Balanced.Credit.create();
		credit.set('destination', Balanced.BankAccount.create({
			'type': 'checking'
		}));
		this.set('model', credit);
		this.set('amount_dollars', null);

		$('#pay-seller').modal({
			manager: this.$()
		});
	},

	actions: {
		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			var self = this;
			var credit = this.get('model');

			var cents = null;
			try {
				cents = Balanced.Utils.dollarsToCents(this.get('amount_dollars'));
			} catch (error) {
				credit.set('validationErrors', {
					'amount': error
				});
				return;
			}
			credit.set('amount', cents);

			credit.save().then(function(credit) {
				$('#pay-seller').modal('hide');
				self.get('controller').transitionToRoute('credits', credit);
			});
		}
	}
});
