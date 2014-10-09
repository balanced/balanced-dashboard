import BaseFundingInstrumentModalView from "./base-funding-instrument-modal";
import CreditExistingFundingInstrumentTransactionFactory from "balanced-dashboard/models/factories/credit-existing-funding-instrument-transaction-factory";

var CreditFundingInstrumentModalView = BaseFundingInstrumentModalView.extend({
	templateName: 'modals/credit-funding-instrument',
	elementId: 'credit-funding-instrument',
	title: function() {
		return "Credit this %@".fmt(this.get("model.destination.type_name").toLowerCase());
	}.property("model.destination.type_name"),
	cancelButtonText: "Cancel",
	submitButtonText: "Credit",

	appearsOnStatementAsLabelText: function() {
		var length = this.get("model.destination.appears_on_statement_max_length");
		return "Appears on statement as (%@ characters max)".fmt(length);
	}.property("model.destination.appears_on_statement_max_length"),

});

CreditFundingInstrumentModalView.reopenClass({
	open: function(fundingInstrument) {
		var credit = CreditExistingFundingInstrumentTransactionFactory.create({
			destination: fundingInstrument
		});
		return this.create({
			model: credit
		});
	},
});

export default CreditFundingInstrumentModalView;
