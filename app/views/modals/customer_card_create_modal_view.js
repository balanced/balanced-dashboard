var Wide = Balanced.Modals.WideModalMixin;
var Save = Balanced.Modals.ObjectSaveMixin;

Balanced.Modals.CustomerCardCreateModalView = Balanced.ModalBaseView.extend(Wide, Save, {
	templateName: 'modals/customer_card_create_modal',
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


	save: function(bankAccount) {
		var self = this;
		this.set("isSaving", true);
		bankAccount.set("validationErrors", null);
		return bankAccount
			.tokenizeAndCreate(this.get('customer.id'))
			.then(function(model) {
				self.set("isSaving", false);
				self.close();
				return model;
			}, function() {
				self.set("isSaving", false);
				return Ember.RSVP.reject();
			});
	},

	actions: {
		toggleOptionalFields: function() {
			this.set('optionalFieldsOpen', !this.get('optionalFieldsOpen'));
			this.reposition();
		},

		save: function() {
			var controller = this.get("controller");
			this.save(this.get("model"))
				.then(function(model) {
					controller.transitionToRoute(model.get("route_name"), model);
				});
		}
	}
});

Balanced.Modals.CustomerCardCreateModalView.reopenClass({
	open: function(customer) {
		return this.create({
			customer: customer
		});
	}
});
