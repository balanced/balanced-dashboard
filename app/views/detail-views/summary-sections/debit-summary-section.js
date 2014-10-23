import SummarySectionView from "./summary-section";

var DebitSummarySectionView = SummarySectionView.extend({
	statusText: Ember.computed.alias('model.status_description'),

	linkedResources: function() {
		return this.resourceLinks("model.refunds", "model.hold", "model.customer", "model.source");
	}.property("model.refunds", "model.refunds.length", "model.hold", "model.customer", "model.source")
});

export default DebitSummarySectionView;
