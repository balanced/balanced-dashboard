Balanced.HoldCardModalView = Balanced.View.extend({
	templateName: 'modals/hold_card',

	dollar_amount: null,

	didInsertElement: function() {
		this.get('controller').on('openHoldCardModal', this, this.open);
	},

	willDestroyElement: function() {
		this.get('controller').off('openHoldCardModal', this, this.open);
	},

	open: function() {
		var hold = Balanced.Hold.create({
			uri: this.get('funding_instrument.card_holds_uri'),
			source_uri: this.get('funding_instrument.uri'),
			amount: null
		});

		this.set('dollar_amount', null);
		this.set('model', hold);

		$('#hold-card').modal({
			manager: this.$()
		});
	},

	actions: {
		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			var hold = this.get('model');

			var cents = null;
			try {
				cents = Balanced.Utils.dollarsToCents(this.get('dollar_amount'));
			} catch (error) {
				hold.set('validationErrors', {
					'amount': error
				});
				return;
			}
			hold.set('amount', cents);

			var self = this;
			hold.save().then(function(hold) {
				$('#hold-card').modal('hide');
				self.get('controller').transitionToRoute('holds', hold);
			});
		}
	}
});
