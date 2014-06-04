Balanced.ChargeCardModalView = Balanced.FundingInstrumentModalView.extend({
	controllerEventName: 'openChargeCardModal',
	modalElement: '#charge-card',
	templateName: 'modals/charge_card',
	validMonths: Balanced.TIME.MONTHS,
	expiration_error: Balanced.computed.orProperties('model.source.validationErrors.expiration_month', 'model.source.validationErrors.expiration_year'),

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
			cvv: '',
			expiration_month: '',
			expiration_year: '',
			address: {}
		}));
		this._super(debit);
	},

	actions: {
		save: function() {
			var model = this.get('model');
			var self = this;
			var card = this.get('model.source');

			if (card.get('isSaving') || model.get('isSaving')) {
				return;
			}

			card.validate();
			this.beforeSave(model);

			if (card.get('isValid') && model.get('isValid')) {
				return card.tokenizeAndCreate().then(function(card) {
					var model = self.get('model');
					model.setProperties({
						uri: card.get('debits_uri'),
						source_uri: card.get('uri')
					});

					model.save().then(_.bind(self.afterSave, self));
				});
			}
		}
	}
});
