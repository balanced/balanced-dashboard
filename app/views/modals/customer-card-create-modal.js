import Computed from "balanced-dashboard/utils/computed";
import Constants from "balanced-dashboard/utils/constants";
import ModalBaseView from "./modal-base";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";
import Full from "balanced-dashboard/views/modals/mixins/full-modal-mixin";
import Save from "balanced-dashboard/views/modals/mixins/object-action-mixin";
import Card from "balanced-dashboard/models/card";

var CustomerCardCreateModalView = ModalBaseView.extend(Full, Form, Save, {
	templateName: 'modals/customer-card-create-modal',
	elementId: "add-card",
	title: "Add a card",
	cancelButtonText: "Cancel",
	submitButtonText: "Add",

	model: function() {
		return Card.create({
			name: '',
			number: '',
			cvv: '',
			expiration_month: '',
			expiration_year: '',
			address: this.get('customer.address') || {}
		});
	}.property(),

	validMonths: Constants.TIME.MONTHS,
	optionalFieldsOpen: false,

	validYears: function() {
		var years = [];

		for (var year = (new Date()).getFullYear(), maxYear = year + 10; year < maxYear; year++) {
			years.push(year);
		}

		return years;
	}.property(),

	expiration_error: Computed.orProperties('model.validationErrors.expiration_month', 'model.validationErrors.expiration_year'),


	save: function(fundingInstrument) {
		var self = this;
		this.set("isSaving", true);
		fundingInstrument.set("validationErrors", null);
		return fundingInstrument
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

CustomerCardCreateModalView.reopenClass({
	open: function(customer) {
		return this.create({
			customer: customer
		});
	}
});

export default CustomerCardCreateModalView;
