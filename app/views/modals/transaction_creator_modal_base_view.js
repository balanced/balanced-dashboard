require("./_modal_base_view");

Balanced.TransactionCreatorModalView = Balanced.ObjectCreatorModalBaseView.extend({
	classNameBindings: [":wide-modal", ":modal-overflow"],
});

Balanced.DebitCustomerModalView = Balanced.TransactionCreatorModalView.extend({
	title: "Debit this customer",
	elementId: "debit-customer",
	templateName: "modals/debit_customer_modal",

	appearsOnStatementAsMaxLength: Ember.computed.oneWay("model.appears_on_statement_max_length"),
	model_class: Balanced.DebitExistingFundingInstrumentTransactionFactory,
	fundingInstruments: Ember.computed.oneWay('customer.debitable_funding_instruments'),
});

Balanced.DebitCustomerModalView.reopenClass({
	open: function(customer, order) {
		return this.create({
			customer: customer,
			order: order
		});
	},
});

Balanced.CreditNewFundingInstrumentModalView = Balanced.TransactionCreatorModalView.extend({
	title: "Credit a bank account",
	templateName: "modals/credit_new_funding_instrument",
	model_class: Balanced.CreditBankAccountTransactionFactory,
	elementId: "pay-seller",

	appearsOnStatementAsMaxLength: Balanced.MAXLENGTH.APPEARS_ON_STATEMENT_BANK_ACCOUNT,
});

Balanced.CreateEscrowCreditModalView = Balanced.TransactionCreatorModalView.extend({
	title: "Add funds",
	templateName: "modals/create_escrow_credit",

	appearsOnStatementAsMaxLength: Balanced.MAXLENGTH.APPEARS_ON_STATEMENT_BANK_ACCOUNT,
	marketplace: function() {
		return Balanced.currentMarketplace;
	}.property(),

	debitableBankAccounts: Ember.computed.readOnly("marketplace.owner_customer.debitable_bank_accounts"),

	model_class: Balanced.DebitExistingBankAccountTransactionFactory,
	elementId: "add-funds"
});

Balanced.CreditCustomerModalView = Balanced.TransactionCreatorModalView.extend({
	title: "Credit this customer",
	elementId: "credit-customer",
	templateName: "modals/credit_customer_modal",

	appearsOnStatementAsMaxLength: Ember.computed.oneWay("model.appears_on_statement_max_length"),
	model_class: Balanced.CreditExistingFundingInstrumentTransactionFactory,
	fundingInstruments: Ember.computed.oneWay('customer.creditable_funding_instruments'),
});

Balanced.CreditCustomerModalView.reopenClass({
	open: function(customer, order) {
		return this.create({
			customer: customer,
			order: order
		});
	},
});
