import SummarySectionBase from "./summary-section-base";

var InvoiceSummarySectionView = SummarySectionBase.extend({
	generateItems: function() {
		var model = this.get("model");
		this.addLabel("Status", "status");
		this.addSummaryItem("invoice-status", {
			model: model,
		});

		this.addLabel("Funding instrument label", {
			textBinding: "summaryView.fundingInstrumentLabelText",
			iconBinding: "summaryView.fundingInstrumentLabelIcon",
			summaryView: this
		});
		this.addSummaryItem("funding-instrument", {
			summaryView: this,
			modelBinding: "summaryView.fundingInstrument"
		});
	},

	isSource: true,
	fundingInstrument: Ember.computed.reads("model.source"),
	fundingInstrumentLabelText: "Source",
	fundingInstrumentLabelIcon: "bank-account"
});

export default InvoiceSummarySectionView;
