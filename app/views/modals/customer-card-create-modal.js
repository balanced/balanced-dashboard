import Computed from "balanced-dashboard/utils/computed";
import ModalBaseView from "./modal-base";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";
import Full from "balanced-dashboard/views/modals/mixins/full-modal-mixin";
import Save from "balanced-dashboard/views/modals/mixins/object-action-mixin";
import CardValidatable from "balanced-dashboard/models/card-validatable";

var CustomerCardCreateModalView = ModalBaseView.extend(Full, Form, Save, {
	templateName: 'modals/customer-card-create-modal',
	elementId: "add-card",
	title: "Add a card",
	cancelButtonText: "Cancel",
	submitButtonText: "Add",

	model: function() {
		return CardValidatable.create({
			name: '',
			number: '',
			cvv: '',
			expiration_month: '',
			expiration_year: '',
			address: this.get('customer.address') || {}
		});
	}.property(),

	expiration_error: Computed.orProperties('model.validationErrors.expiration_month', 'model.validationErrors.expiration_year'),
	isSaving: Ember.computed.oneWay("model.isSaving"),

	save: function(fundingInstrument) {
		var self = this;
		fundingInstrument.get("validationErrors").clear();
		return fundingInstrument
			.tokenizeAndCreate(this.get('customer.id'))
			.then(function(model) {
				self.close();
				return model;
			});
	},

	actions: {
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
