`import Ember from "ember";`
`import TransactionBaseSummarySection from "./transaction-base-summary-section";`

HoldSummarySectionView = TransactionBaseSummarySection.extend(
	fundingInstrument: Ember.computed.reads("model.source")
	isSource: true
)

`export default HoldSummarySectionView;`
