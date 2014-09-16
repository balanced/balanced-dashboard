Balanced.Modals.BankAccountCreditCreateModalView = Balanced.TransactionCreatorModalView.extend({
	title: "Credit a bank account",
	templateName: "modals/bank_account_credit_create_modal",
	model_class: Balanced.CreditBankAccountTransactionFactory,
	elementId: "pay-seller",

	appearsOnStatementAsMaxLength: Balanced.MAXLENGTH.APPEARS_ON_STATEMENT_BANK_ACCOUNT,
});
