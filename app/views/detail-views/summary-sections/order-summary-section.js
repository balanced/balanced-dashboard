import SummarySectionView from "./summary-section";

var OrderSummarySectionView = SummarySectionView.extend({
	statusText: function() {
		if (this.get("model.status") === "overdue") {
			return "Funds in this order are older than 30 days. Pay out your outstanding balance now.";
		}
		return null;
	}.property("model.status"),

	linkedResources: function() {
		return this.resourceLinks("model.description", "model.seller");
	}.property("model.description", "model.seller")
});

export default OrderSummarySectionView;
