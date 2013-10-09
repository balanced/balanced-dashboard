Balanced.RefundDebitModalComponent = Ember.Component.extend({
	submitAction: 'submitRefundDebit',
	classNames: ['modal-container'],

	willDestroyElement: function() {
		$('#refund-debit').modal('hide');
	},

	actions: {
		open: function() {
			var refund = Balanced.Refund.create({
				uri: this.get('debit.refunds_uri'),
				debit_uri: this.get('debit.uri'),
				amount: null
			});

			var self = this;
			refund.on('didCreate', function() {
				$('#refund-debit').modal('hide');
			});

			this.set('dollar_amount', this.get('debit.amount_dollars'));
			this.set('model', refund);

			$('#refund-debit').modal({
				manager: this.$()
			});
		},

		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}

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

			this.sendAction('submitAction', refund);
		}
	}
});
