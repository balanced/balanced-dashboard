import SummarySectionView from "./summary-section";

var HoldSummarySectionView = SummarySectionView.extend({
	statusText: Ember.computed.reads('model.status_description'),
	linkedResources: function() {
		return this.resourceLinks("model.description", "model.customer", "model.source");
	}.property("model.customer", "model.source", "model.description")
});

export default HoldSummarySectionView;
