Balanced.DebitFundingInstrumentModalView = Balanced.View.extend({
	templateName: 'modals/debit_funding_instrument',

	dollar_amount: null,

	didInsertElement: function() {
		this.get('controller').on('openDebitFundingInstrumentModal', this, this.open);
		this._super();
	},

	willDestroyElement: function() {
		this.get('controller').off('openDebitFundingInstrumentModal', this, this.open);
		this._super();
	},

	open: function() {
		var debit = Balanced.Debit.create({
			uri: this.get('funding_instrument.debits_uri'),
			source_uri: this.get('funding_instrument.uri'),
			amount: null
		});

		this.set('dollar_amount', null);
		this.set('model', debit);

		$('#debit-funding-instrument').modal({
			manager: this.$()
		});
	},

	actions: {
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

			var self = this;
			debit.save().then(function(debit) {
				$('#debit-funding-instrument').modal('hide');
				self.get('controller').transitionToRoute('debits', debit);
			});
		}
	}
});
