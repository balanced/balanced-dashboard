require('app/components/modal');

Balanced.RefundDebitModalComponent = Balanced.ModalComponent.extend({
	submitAction: 'submitRefundDebit',

	actions: {
		open: function() {
			var refund = Balanced.Refund.create({
				uri: this.get('debit.refunds_uri'),
				debit_uri: this.get('debit.uri'),
				amount: null
			});

			this.set('dollar_amount', this.get('debit.amount_dollars'));
			this._super(refund);
		},

		save: function() {
			var refund = this.get('model');

			var cents = null;
			try {
				cents = Balanced.Utils.dollarsToCents(this.get('dollar_amount'));
			} catch (error) {
				refund.set('validationErrors', {
					'amount': error
				});

				return;
			}

			refund.set('amount', cents);

			this._super(refund);
		}
	}
});
