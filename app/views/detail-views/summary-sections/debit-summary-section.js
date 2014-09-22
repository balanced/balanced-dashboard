import SummarySectionView from "summary-section-view";

var DebitSummarySectionView = SummarySectionView.extend({
	statusText: Ember.computed.alias('model.status_description'),

	linkedResources: function() {
		return this.resourceLinks("model.order", "model.refunds", "model.hold", "model.customer", "model.source");
	}.property("model.order", "model.refunds", "model.refunds.length", "model.hold", "model.customer", "model.source")
});

export default DebitSummarySection;
