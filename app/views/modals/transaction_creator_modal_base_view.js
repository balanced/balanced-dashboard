require("./_modal_base_view");

Balanced.TransactionCreatorModalView = Balanced.ObjectCreatorModalBaseView.extend({
	classNameBindings: [":wide-modal", ":modal-overflow"],
});

Balanced.DebitNewFundingInstrumentModalView = Balanced.TransactionCreatorModalView.extend({
	title: "Debit a card",
	templateName: "modals/debit_new_funding_instrument",
	model_class: Balanced.CardDebitTransactionFactory,
	elementId: "charge-card",

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
	elementId: "pay-seller"
});
