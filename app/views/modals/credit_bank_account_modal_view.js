var ValidationHelpers = Balanced.ValidationHelpers

var CreditBankAccountBuilder = Ember.Object.extend(Ember.Validations, {
	isSaving: false,
	amount: function() {
		try {
			return Balanced.Utils.dollarsToCents(this.get('dollar_amount'));
		} catch(e) {
			return NaN;
		}
	}.property("dollar_amount"),

	getAttributes: function() {
		return {
			amount: this.get("amount"),
			appears_on_statement_as: this.get("appears_on_statement_as"),
			description: this.get("description"),
			destination: this.getProperties("account_number", "name", "routing_number", "account_type")
		};
	},

	save: function() {
		var self = this;
		var credit = Balanced.Credit.create(this.getAttributes());
		this.set("isSaving", true);
		return credit.save().then(function(model) {
			self.set("isSaving", false);
			return model;
		});
	},

	validations: {
		name: ValidationHelpers.bankAccountName,
		routing_number: ValidationHelpers.bankAccountRoutingNumber,
		account_number: ValidationHelpers.bankAccountNumber,
		account_type: ValidationHelpers.bankAccountType,
		dollar_amount: ValidationHelpers.positiveDollarAmount,
		appears_on_statement_as: ValidationHelpers.transactionAppearsOnStatementAs,
	}
});

Balanced.CreditBankAccountModalView = Balanced.ModalBaseView.extend({
	title: "Credit a bank account",
	templateName: "modals/credit_bank_account",
	classNameBindings: [":wide-modal", ":modal-overflow"],

	model: function() {
		return CreditBankAccountBuilder.create();
	}.property(),

	actions: {
		submit: function() {
			var self = this;
			var model = this.get("model");
			model.validate();
			if (model.get("isValid")) {
				model.save().then(function(credit) {
					self.get('controller').transitionToRoute(credit.get('route_name'), credit);
					self.close();
				});
			}
		}
	}
});
