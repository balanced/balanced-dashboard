import SummarySectionView from "./summary-section";

var HoldSummarySectionView = SummarySectionView.extend({
	linkedResources: function() {
		return this.resourceLinks("model.customer", "model.source");
	}.property("model.customer", "model.source")
});

export default HoldSummarySectionView;
