import SummarySectionView from "./summary-section";

var RefundSummarySectionView = SummarySectionView.extend({
	statusText: Ember.computed.alias('model.status_description'),

	linkedResources: function() {
		return this.resourceLinks("model.debit.customer", "model.debit.source");
	}.property("model.debit.refunds.length", "model.debit.customer", "model.debit.source")
});

export default RefundSummarySectionView;
