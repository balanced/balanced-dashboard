require('app/components/modal');

Balanced.AddCardModalComponent = Balanced.ModalComponent.extend({
	validMonths: Balanced.TIME.MONTHS,
	optionalFieldsOpen: false,

	validYears: function() {
		var years = [];

		for (var year = (new Date()).getFullYear(), maxYear = year + 10; year < maxYear; year++) {
			years.push(year);
		}

		return years;
	}.property(),

	expiration_error: Balanced.computed.orProperties('model.validationErrors.expiration_month', 'model.validationErrors.expiration_year'),

	actions: {
		open: function() {
			var card = Balanced.Card.create({
				name: '',
				number: '',
				cvv: '',
				expiration_month: '',
				expiration_year: '',
				address: this.get('customer.address') || {}
			});
			this.set('optionalFieldsOpen', false);

			this._super(card);
		},

		toggleOptionalFields: function() {
			this.set('optionalFieldsOpen', !this.get('optionalFieldsOpen'));
			this.reposition();
		},

		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			var self = this;
			var card = this.get('model');

			card.tokenizeAndCreate(this.get('customer.id')).then(function() {
				if (self.get('customer')) {
					self.get('customer.cards').reload();
				}

				self.hide();
			});
		}
	}
});
