Balanced.Modals.CustomerAddCardModalView = Balanced.ModalBaseView.extend({
	classNameBindings: [":wide-modal", ":modal-overflow"],
	templateName: 'modals/customer_add_card_modal',
	elementId: "add-card",
	title: "Add a card",

	model: function() {
		return Balanced.Card.create({
			name: '',
			number: '',
			cvv: '',
			expiration_month: '',
			expiration_year: '',
			address: this.get('customer.address') || {}
		});
	}.property(),

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


	isSaving: false,
	actions: {
		toggleOptionalFields: function() {
			this.set('optionalFieldsOpen', !this.get('optionalFieldsOpen'));
			this.reposition();
		},

		save: function() {
			var self = this;
			var card = this.get('model');
			card.set("validationErrors", undefined);
			this.set("isSaving", true);
			card
				.tokenizeAndCreate(this.get('customer.id'))
				.then(function(model) {
					self.get("controller").transitionToRoute(model.get("route_name"), model);
					self.close();
				}, function() {})
				.then(function() {
					self.set("isSaving", false);
				});
		}
	}
});

Balanced.Modals.CustomerAddCardModalView.reopenClass({
	open: function(customer) {
		return this.create({
			customer: customer
		});
	}
});
