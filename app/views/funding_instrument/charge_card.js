Balanced.ChargeCardModalView = Balanced.FundingInstrumentModalView.extend({
	controllerEventName: 'openChargeCardModal',
	modalElement: '#charge-card',
	templateName: 'modals/charge_card',
	validMonths: Balanced.TIME.MONTHS,
	expiration_error: Balanced.computed.orProperties('model.validationErrors.expiration_month', 'model.validationErrors.expiration_year'),

	validYears: function() {
		var years = [];

		for (var year = (new Date()).getFullYear(), maxYear = year + 10; year < maxYear; year++) {
			years.push(year);
		}

		return years;
	}.property(),

	open: function() {
		var debit = Balanced.Debit.create();
		debit.set('source', Balanced.Card.create({
			name: '',
			number: '',
			security_code: '',
			expiration_month: '',
			expiration_year: '',
			address: {}
		}));
		this._super(debit);
	},

	actions: {
		save: function() {
			var self = this;
			var card = this.get('model.source');
			if (this.beforeSave(this.get('model')) === false) {
				return;
			}

			if (!card.validate() && card.get('validationErrors.length')) {
				return;
			}

			if (card.get('isSaving') || this.get('model.isSaving')) {
				return;
			}

			return card.tokenizeAndCreate().then(function(card) {
				var model = self.get('model');
				model.setProperties({
					uri: card.get('debits_uri'),
					source_uri: card.get('uri')
				});

				model.save()
					.then(function() {
						return model.get('source').reload();
					})
					.then(function(card) {
						self.afterSave(model);
					});
			});
		}
	}
});
