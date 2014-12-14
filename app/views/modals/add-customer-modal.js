import ModalBaseView from "./modal-base";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";
import Full from "balanced-dashboard/views/modals/mixins/full-modal-mixin";
import Save from "balanced-dashboard/views/modals/mixins/object-action-mixin";

var AddCustomerModal = ModalBaseView.extend(Full, Form, Save, {
	templateName: "modals/customer-info-modal",
	elementId: "add-customer",
	title: "Add a customer",
	cancelButtonText: "Cancel",
	submitButtonText: "Add",

	successAlertText: "Your customer was created successfully",

	onModelSaved: function(model) {
		var Customer = this.get("container").lookupFactory("model:customer");
		var controller = this.container.lookup("controller:marketplace");
		return Customer.find(model.get("href")).then(function(m) {
			controller.transitionToRoute("customer", m);
		});
	},

	actions: {
		save: function() {
			this.save(this.get("model"));
		}
	}
});

AddCustomerModal.reopenClass({
	open: function() {
		var modal = this.create();
		var store = modal.container.lookup("controller:marketplace").get("store");
		var customer = store.build("customer", {
			name: null,
			email: null,
			business_name: null,
			ein: null,
			address: {},
			dob_month: null,
			dob_year: null,
			ssn_last4: null,
			meta: {}
		});
		modal.set("model", customer);
		return modal;
	},
});

export default AddCustomerModal;
