import SummarySectionBase from "./transaction-base-summary-section";

var RefundSummarySectionView = SummarySectionBase.extend({
	generateItems: function() {
		var model = this.get("model");
		this.addLabel("Status", "status");
		this.addSummaryItem("refund-status", {
			model: model,
		});

		this.addInternalDescriptionLabel();
		this.addSummaryItem("model-description", {
			model: model
		});

		this.addLabel("Customer", "customers");
		this.addSummaryItem("customer", {
			sectionView: this,
			modelBinding: "sectionView.debit.customer"
		});
		this.addLabel("Funding instrument", {
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
	fundingInstrument: Ember.computed.reads("model.debit.source"),
});

export default RefundSummarySectionView;
