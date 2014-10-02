import ModalBaseView from "./modal-base";
import Full from "balanced-dashboard/views/modals/mixins/full-modal-mixin";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";
import Save from "balanced-dashboard/views/modals/mixins/object-action-mixin";
import BankAccount from "balanced-dashboard/models/bank-account";

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

	model: function() {
		return BankAccount.create({
			name: '',
			account_number: '',
			routing_number: '',
			account_type: 'checking'
		});
	}.property(),

	save: function() {
		var self = this;
		var fundingInstrument = this.get("model");
		this.set("isSaving", true);
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
		save: function() {
			var controller = this.get("controller");
			this.save()
				.then(function(model) {
					controller.transitionToRoute(model.get("route_name"), model);
				});
		}
	}
});

CustomerBankAccountCreateModalView.reopenClass({
	open: function(customer) {
		return this.create({
			customer: customer
		});
	}
});

export default CustomerBankAccountCreateModalView;
