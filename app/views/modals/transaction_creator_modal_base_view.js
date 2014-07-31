require("./_modal_base_view");

Balanced.TransactionCreatorModalView = Balanced.ObjectCreatorModalBaseView.extend({
	classNameBindings: [":wide-modal", ":modal-overflow"],
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
