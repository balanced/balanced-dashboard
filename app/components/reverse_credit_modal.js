require('app/components/modal');

Balanced.ReverseCreditModalComponent = Balanced.ModalComponent.extend({
	submitAction: 'submitReverseCredit',

	actions: {
		open: function() {
			var reversal = Balanced.Reversal.create({
				uri: this.get('credit.reversals_uri'),
				credit_uri: this.get('credit.uri'),
				amount: null
			});

			this.set('dollar_amount', this.get('credit.amount_dollars'));
			this._super(reversal);
		},

		save: function() {
			var reversal = this.get('model');

			var cents = null;
			try {
				cents = Balanced.Utils.dollarsToCents(this.get('dollar_amount'));
			} catch (error) {
				reversal.set('validationErrors', {
					'amount': error
				});

				return;
			}

			reversal.set('amount', cents);

			this._super(reversal);
		}
	}
});
