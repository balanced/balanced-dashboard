import SummarySectionBase from "./summary-section-base";

var CustomerSummarySectionView = SummarySectionBase.extend({
	generateItems: function() {
		var model = this.get("model");
		this.addLabel("Status", "status");
		this.addSummaryItem("customer-status", {
			model: model,
		});
	},
});

export default CustomerSummarySectionView;
