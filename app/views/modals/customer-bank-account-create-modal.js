import Ember from "ember";
import ModalBaseView from "./modal-base";
import Full from "./mixins/full-modal-mixin";
import Form from "./mixins/form-modal-mixin";
import Save from "./mixins/object-action-mixin";
import BankAccountValidatable from "balanced-dashboard/models/bank-account-validatable";

var CustomerBankAccountCreateModalView = ModalBaseView.extend(Full, Form, Save, {
	templateName: 'modals/customer-bank-account-create-modal',
	elementId: "add-bank-account",
	title: "Add a bank account",
	cancelButtonText: "Cancel",
	submitButtonText: "Add",

	bankAccountTypes: [{
		value: "checking",
		label: "Checking",
	}, {
		value: "savings",
		label: "Savings"
	}],

	onModelSaved: function(model) {
		var controller = this.container.lookup("controller:marketplace");
		controller.transitionToRoute(model.get("route_name"), model);
	},

	save: function(model) {
		var customerId = this.get("customer.id");
		return this.executeAction(function() {
			return model.tokenizeAndCreate(customerId);
		});
	},

	actions: {
		save: function() {
			this.save(this.get("model"));
		}
	}
});

CustomerBankAccountCreateModalView.reopenClass({
	open: function(customer) {
		var bankAccount = BankAccountValidatable.create({
			name: '',
			account_number: '',
			routing_number: '',
			account_type: 'checking'
		});
		return this.create({
			model: bankAccount,
			customer: customer
		});
	}
});

export default CustomerBankAccountCreateModalView;
