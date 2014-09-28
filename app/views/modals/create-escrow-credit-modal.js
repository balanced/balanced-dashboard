import Ember from "ember";
import Constants from "balanced-dashboard/utils/constants";
import TransactionCreatorModalView from "./transaction-creator-modal";
import DebitExistingBankAccountTransactionFactory from "balanced-dashboard/models/factories/debit-existing-bank-account-transaction-factory";

var CreateEscrowCreditModalView = TransactionCreatorModalView.extend({
	title: "Add funds",
	templateName: "modals/create-escrow-credit",
	elementId: "add-funds",

	appearsOnStatementAsMaxLength: Constants.MAXLENGTH.APPEARS_ON_STATEMENT_BANK_ACCOUNT,
	debitableBankAccounts: Ember.computed.readOnly("marketplace.owner_customer.debitable_bank_accounts"),

	model_class: DebitExistingBankAccountTransactionFactory,
});

CreateEscrowCreditModalView.reopenClass({
	open: function(marketplace) {
		return this.create({
			marketplace: marketplace
		});
	},
});

export default CreateEscrowCreditModalView;
