import SummarySectionView from "./summary-section";

var ReversalSummarySectionView = SummarySectionView.extend({
	linkedResources: function() {
		return this.resourceLinks("model.credit.customer", "model.credit.destination");
	}.property("model.credit.customer", "model.credit.destination")
});

export default ReversalSummarySectionView;
