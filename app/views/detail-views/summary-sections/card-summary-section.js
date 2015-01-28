import BaseSummarySection from "./summary-section-base";

var CardSummarySectionView = BaseSummarySection.extend({
	generateItems: function() {
		var model = this.get("model");
		this.addLabel("Status", "status");
		this.addSummaryItem("card-status", {
			model: model
		});

		this.addLabel("Customer", "customers");
		this.addSummaryItem("customer", {
			modelBinding: "fundingInstrument.customer", fundingInstrument: model
		});
	},
});

export default CardSummarySectionView;
