require("./_modal_base_view");

Balanced.TransactionCreatorModalView = Balanced.ObjectCreatorModalBaseView.extend({
	classNameBindings: [":wide-modal", ":modal-overflow"],
});

Balanced.DebitNewFundingInstrumentModalView = Balanced.TransactionCreatorModalView.extend({
	title: "Debit a card",
	templateName: "modals/debit_new_funding_instrument",
	model_class: Balanced.CardDebitTransactionFactory,
	elementId: "charge-card",

	appearsOnStatementAsMaxLength: Balanced.MAXLENGTH.APPEARS_ON_STATEMENT_CARD,

	validMonths: Balanced.TIME.MONTHS,
	validYears: function() {
		var years = [];
		var currentYear = (new Date()).getFullYear();
		return _.times(10, function(i) {
			return currentYear + i;
		});
	}.property(),
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
