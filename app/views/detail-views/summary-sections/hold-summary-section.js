import SummarySectionView from "./summary-section";

var HoldSummarySectionView = SummarySectionView.extend({
	linkedResources: function() {
		return this.resourceLinks("model.debit.order", "model.debit.dispute", "model.debit", "model.debit.refunds", "model.customer", "model.source");
	}.property("model.debit.order", "model.debit.dispute", "model.debit", "model.debit.refunds", "model.debit.refunds.length", "model.customer", "model.source")
});

