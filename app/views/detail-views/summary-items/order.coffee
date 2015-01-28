`import Base from "./base";`
`import Utils from "balanced-dashboard/lib/utils";`

Order = Base.extend(
	isLoading: Ember.computed.reads("model.isLoading")
	isLink: true

	text: Ember.computed "model.amount_escrowed", ->
		amount = @get("model.amount_escrowed")
		"$#{Utils.centsToDollars(amount)}"

	hoverValue: Ember.computed "model.created_at", ->
		date = @get("model.created_at")
		"Created at #{Utils.humanReadableDateShort(date)}"
)

`export default Order;`
