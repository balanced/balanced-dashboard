import ModalBaseView from "./modal-base";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";
import Full from "balanced-dashboard/views/modals/mixins/full-modal-mixin";
import Save from "balanced-dashboard/views/modals/mixins/object-action-mixin";
import Customer from "balanced-dashboard/models/customer";
import Constants from "balanced-dashboard/utils/constants";

var AddCustomerModal = ModalBaseView.extend(Full, Form, Save, {
	templateName: "modals/customer-info-modal",
	elementId: "add-customer",
	title: "Add a customer",
	cancelButtonText: "Cancel",
	submitButtonText: "Add",

	actions: {
		save: function() {
			var controller = this.get("controller");
			var customer = this.get("model");

			for (var prop in customer) {
				if (customer.hasOwnProperty(prop) && customer[prop] === '') {
					customer.set(prop, null);
				}
			}
			this.save(customer)
				.then(function(model) {
					controller.transitionToRoute(model.get("route_name"), model);
				});
		}
	}
});

AddCustomerModal.reopenClass({
	open: function() {
		return this.create({
			model: Customer.create({
				name: null,
				email: null,
				business_name: null,
				ein: null,
				address: {},
				dob_month: null,
				dob_year: null,
				ssn_last4: null,
				meta: {}
			})
		});
	},
});

export default AddCustomerModal;
