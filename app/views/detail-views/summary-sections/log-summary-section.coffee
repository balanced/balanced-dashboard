`import SummarySectionBase from "./summary-section-base";`

LogSummarySectionView = SummarySectionBase.extend({
	generateItems: ->
		model = @get("model")
		@addLabel("Status", "status")
		@addSummaryItem("log-status", model: model)

		@addModelItem "Order", "order", "order"
		@addTransactionItem "Hold", "hold"
		@addTransactionItem "Debit", "debit"
		@addTransactionItem "Credit", "Credit"
		@addTransactionItem "Refund", "refund"
		@addTransactionItem "Reversal", "reversal"
		@addTransactionItem "Dispute", "dispute"

		if @get("model.customer")
			@addLabel("Customer", "customers")
			@addSummaryItem("customer", modelBinding: "log.customer", log: @get("model"))

		if @get("model.card")
			@addLabel("Card", "card")
			@addSummaryItem("funding-instrument", modelBinding: "log.card", log: @get("model"))

		if @get("model.bank_account")
			@addLabel("Bank account", "bank-account")
			@addSummaryItem("funding-instrument", modelBinding: "log.bank_account", log: @get("model"))

	addModelItem: (label, binding, view) ->
		if @get("model.#{binding}")
			@addLabel label, "single-transaction"
			@addSummaryItem view, modelBinding: "log.#{binding}", log: @get("model")

	addTransactionItem: (label, binding) ->
		@addModelItem(label, binding, "transaction")

	linkedResources: ->
		return this.resourceLinks("model.order", "model.debit", "model.credit", "model.refund", "model.reversal", "model.hold", "model.customer", "model.card", "model.bank_account")
})

`export default LogSummarySectionView;`
