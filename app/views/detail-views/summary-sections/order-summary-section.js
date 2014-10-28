import SummarySectionView from "./summary-section";

var OrderSummarySectionView = SummarySectionView.extend({
	linkedResources: function() {
		return this.resourceLinks("model.description");
	}.property("model.description")
});

export default OrderSummarySectionView;
