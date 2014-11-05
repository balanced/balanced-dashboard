import SummarySectionView from "./summary-section";

var OrderSummarySectionView = SummarySectionView.extend({
	statusText: function() {
		if (this.get("model.status") === "overdue") {
			return "Funds cannot be held for more than 30 days. Pay out your outstanding balance now.";
		}
		return null;
	}.property("model.status"),

	linkedResources: function() {
		return this.resourceLinks("model.description");
	}.property("model.description")
});

export default OrderSummarySectionView;
