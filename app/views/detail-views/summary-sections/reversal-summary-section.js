import SummarySectionView from "./summary-section";

var ReversalSummarySectionView = SummarySectionView.extend({
	statusText: Ember.computed.alias('model.status_description'),

	linkedResources: function() {
		return this.resourceLinks("model.credit.order", "model.credit", "model.credit.reversals", "model.credit.customer", "model.credit.destination");
	}.property("model.credit.order", "model.credit", "model.credit.reversals", "model.credit.reversals.length", "model.credit.customer", "model.credit.destination")
});

export default ReversalSummarySectionView;
