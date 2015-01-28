`import Ember from "ember";`
`import TransactionBaseSummarySection from "./transaction-base-summary-section";`

DebitSummarySectionView = TransactionBaseSummarySection.extend(
	fundingInstrument: Ember.computed.reads("model.source")
	isSource: true
)

`export default DebitSummarySectionView;`
