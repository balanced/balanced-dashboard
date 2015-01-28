import TransactionBaseSummarySection from "./transaction-base-summary-section";

var ReversalSummarySectionView = TransactionBaseSummarySection.extend({
	fundingInstrument: Ember.computed.reads("model.credit.destination")
});

export default ReversalSummarySectionView;

