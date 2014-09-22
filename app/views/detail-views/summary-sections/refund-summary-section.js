import SummarySectionView from "./summary-section";

var RefundSummarySectionView = SummarySectionView.extend({
	linkedResources: function() {
		return this.resourceLinks("model.debit.order", "model.debit.dispute", "model.debit", "model.debit.refunds", "model.debit.customer", "model.debit.source");
	}.property("model.debit.order", "model.debit.dispute", "model.debit", "model.debit.refunds", "model.debit.refunds.length", "model.debit.customer", "model.debit.source")
});

export default RefundSummarySectionView;