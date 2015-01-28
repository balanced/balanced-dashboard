`import Ember from "ember";`
`import SummarySectionBaseView from "./summary-section-base";`

TransactionBaseSummarySection = SummarySectionBaseView.extend(
	generateItems: ->
		model = @get("model")
		@addLabel("Status", "status")
		@addSummaryItem("transaction-status", model: model)

		@addLabel "Internal description", "description"
		@addSummaryItem("model-description", model: model)

		@addLabel "Customer", "customers"
		@addSummaryItem("customer", modelBinding: "transaction.customer", transaction: model)

		@addLabel("Funding instrument",
			textBinding: "summaryView.fundingInstrumentLabelText"
			iconBinding: "summaryView.fundingInstrumentLabelIcon"
			summaryView: @
		)
		@addSummaryItem("funding-instrument",
			summaryView: @
			modelBinding: "summaryView.fundingInstrument"
		)

	isSource: false
	fundingInstrument: Ember.computed.reads("model.destination"),

	fundingInstrumentLabelText: Ember.computed "isSource", "fundingInstrument.isCard", ->
		isSource = @get("isSource")
		isCard = @get("fundingInstrument.isCard")

		if isSource
			textPrefix = "Source"
		else
			textPrefix = "Destination"

		if Ember.isBlank(isCard)
			return textPrefix
		else
			if isCard
				"#{textPrefix} card"
			else
				"#{textPrefix} bank account"

	fundingInstrumentLabelIcon: Ember.computed "fundingInstrument.isCard", ->
		isCard = @get("fundingInstrument.isCard")
		if !Ember.isBlank(isCard)
			if isCard
				"card"
			else
				"bank-account"
)

`export default TransactionBaseSummarySection;`
