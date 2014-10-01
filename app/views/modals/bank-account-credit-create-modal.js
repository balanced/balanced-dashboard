import TransactionCreatorModalView from "./transaction-creator-modal";
import Constants from "balanced-dashboard/utils/constants";
import CreditBankAccountTransactionFactory from "balanced-dashboard/models/factories/credit-bank-account-transaction-factory";

var BankAccountCreditCreateModalView = TransactionCreatorModalView.extend({
	title: "Credit a bank account",
	templateName: "modals/bank-account-credit-create-modal",
	model_class: CreditBankAccountTransactionFactory,
	elementId: "pay-seller",

	bankAccountTypes: Constants.BANK_ACCOUNT_TYPES.map(function(name) {
		return {
			value: name.toLowerCase(),
			label: name
		};
	}),

	appearsOnStatementAsMaxLength: Constants.MAXLENGTH.APPEARS_ON_STATEMENT_BANK_ACCOUNT,
});

export default BankAccountCreditCreateModalView;
