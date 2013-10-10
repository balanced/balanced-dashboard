Balanced.CaptureHoldModalComponent = Ember.Component.extend({
	submitAction: 'submitCaptureHold',
	classNames: ['modal-container'],

	willDestroyElement: function() {
		$('#capture-hold').modal('hide');
	},

	actions: {
		open: function() {
			var debit = Balanced.Debit.create({
				uri: this.get('hold.debits_uri'),
				hold_uri: this.get('hold.uri'),
				amount: null
			});

			var self = this;
			debit.on('didCreate', function() {
				$('#capture-hold').modal('hide');
			});

			this.set('dollar_amount', this.get('hold.amount_dollars'));
			this.set('model', debit);

			$('#capture-hold').modal({
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
	}
});
