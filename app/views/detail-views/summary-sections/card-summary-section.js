import SummarySectionView from "./summary-section";

var CardSummarySectionView = SummarySectionView.extend({
	linkedResources: function() {
		return this.resourceLinks("model.customer");
	}.property("model.customer")
});

export default CardSummarySectionView;