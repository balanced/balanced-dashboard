Balanced.Modals.CustomerAddBankAccountModalView = Balanced.ModalBaseView.extend({
	classNameBindings: [":wide-modal", ":modal-overflow"],
	templateName: 'modals/customer_add_bank_account_modal',
	elementId: "add-bank-account",
	title: "Add a bank account",

	bankAccountTypes: [{
		value: "checking",
		label: "Checking",
	}, {
		value: "savings",
		label: "Savings"
	}],

	model: function() {
		return Balanced.BankAccount.create({
			name: '',
			account_number: '',
			routing_number: '',
			account_type: 'checking'
		});
	}.property(),

	isSaving: false,
	actions: {
		save: function() {
			var self = this;
			var bankAccount = this.get('model');
			this.set("isSaving", true);
			bankAccount
				.tokenizeAndCreate(this.get('customer.id'))
				.then(function(model) {
					self.get("controller").transitionToRoute(model.get("route_name"), model);
					self.set("isSaving", false);
					self.close();
				}, function() {
					self.set("isSaving", false);
				});
		}
	}
});

Balanced.Modals.CustomerAddBankAccountModalView.reopenClass({
	open: function(customer) {
		return this.create({
			customer: customer
		});
	}
});
