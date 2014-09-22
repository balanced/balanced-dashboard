import SummarySectionView from "./summary-section";

var OrderSummarySectionView = SummarySectionView.extend({
	linkedResources: function() {
		return this.resourceLinks("model.seller");
	}.property("model.seller", "model.buyers")
});

export default OrderSummarySectionView;
