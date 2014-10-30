import SummarySectionView from "./summary-section";

var ReversalSummarySectionView = SummarySectionView.extend({
	statusText: Ember.computed.alias('model.status_description'),

	linkedResources: function() {
		return this.resourceLinks("model.description", "model.credit.customer", "model.credit.destination");
	}.property("model.description", "model.credit.customer", "model.credit.destination")
});

export default ReversalSummarySectionView;
