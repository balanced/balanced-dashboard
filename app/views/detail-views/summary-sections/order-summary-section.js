import SummarySectionBase from "./summary-section-base";

var OrderSummarySectionView = SummarySectionBase.extend({
	generateItems: function() {
		var model = this.get("model");
		this.addLabel("Status", "status");
		this.addSummaryItem("order-status", {
			model: model,
		});

		this.addLabel("Internal description", "description");
		this.addSummaryItem("model-description", {
			model: model
		});

		this.addLabel("Merchant", "customers");
		this.addSummaryItem("customer", {
			sectionView: this,
			modelBinding: "sectionView.merchant"
		});
	},

	merchant: Ember.computed.reads("model.seller")
});

export default OrderSummarySectionView;
