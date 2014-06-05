var ValidationHelpers = Balanced.ValidationHelpers;

var CreditBankAccountBuilder = Ember.Object.extend(Ember.Validations, {
	amount: function() {
		try {
			return "" + Balanced.Utils.dollarsToCents(this.get('dollar_amount'));
		} catch (e) {
			return undefined;
		}
	}.property("dollar_amount"),

	destination: Balanced.computed.getProperties("account_number", "name", "routing_number", "account_type"),

	getAttributes: function() {
		return this.getProperties("amount", "appears_on_statement_as", "description", "destination");
	},

	save: function() {
		return Balanced.Credit.create(this.getAttributes()).save();
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

Balanced.CreditBankAccountModalView = Balanced.ObjectCreatorModalBaseView.extend({
	title: "Credit a bank account",
	templateName: "modals/credit_bank_account",
	classNameBindings: [":wide-modal", ":modal-overflow"],

	model_class: CreditBankAccountBuilder,
});

Balanced.CreditBankAccountModalView.reopenClass({
	ObjectCreatorClass: CreditBankAccountBuilder
});
