require("./_modal_base_view");

Balanced.TransactionCreatorModalView = Balanced.ObjectCreatorModalBaseView.extend({
	classNameBindings: [":wide-modal", ":modal-overflow"],
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
	elementId: "add-funds",

	appearsOnStatementAsMaxLength: Balanced.MAXLENGTH.APPEARS_ON_STATEMENT_BANK_ACCOUNT,
	debitableBankAccounts: Ember.computed.readOnly("marketplace.owner_customer.debitable_bank_accounts"),

	model_class: Balanced.DebitExistingBankAccountTransactionFactory,
});

Balanced.CreateEscrowCreditModalView.reopenClass({
	open: function(marketplace) {
		return this.create({
			marketplace: marketplace
		});
	},
});
