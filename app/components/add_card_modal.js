require('app/components/modal');

Balanced.AddCardModalComponent = Balanced.ModalComponent.extend({
	validMonths: Balanced.TIME.MONTHS,
	validYears: function() {
		var years = [];

		for (var year = (new Date()).getFullYear(), maxYear = year + 10; year < maxYear; year++) {
			years.push(year);
		}

		return years;
	}.property(),

	expiration_error: function() {
		return this.get('model.validationErrors.expiration_month') || this.get('model.validationErrors.expiration_year');
	}.property('model.validationErrors.expiration_month', 'model.validationErrors.expiration_year'),

	actions: {
		open: function() {
			var card = Balanced.Card.create({
				name: '',
				number: '',
				security_code: '',
				expiration_month: '',
				expiration_year: '',
				postal_code: ''
			});

			this._super(card);
		},

		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			var self = this;
			var card = this.get('model');

			card.tokenizeAndCreate(this.get('customer.id')).then(function() {
				self.get('customer.cards').reload();
				self.hide();
			});
		}
	}
});
