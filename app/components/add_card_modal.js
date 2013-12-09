require('app/components/modal');

Balanced.AddCardModalComponent = Balanced.ModalComponent.extend({
	validMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
	validYears: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],

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
