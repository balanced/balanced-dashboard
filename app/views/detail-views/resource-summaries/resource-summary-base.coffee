`import Ember from "ember";`
`import Utils from "balanced-dashboard/lib/utils";`

ResourceSummaryBase = Ember.View.extend(
	templateName: "detail-views/resource-summary"
	tagName: "dd"

	hasDescription: Ember.computed.notEmpty("model.description")

	value: (->
		model = @get("model")
		if @isType("order")
			'$%@'.fmt(Utils.centsToDollars(model.get('amount_escrowed')))
		else if @isType("debit", "hold", "credit", "refund", "reversal", "dispute")
			'$%@'.fmt(Utils.centsToDollars(model.get('amount')))
		else if @isType("customer")
			model.get("display_me")
		else if @isType("card")
			"#{model.get('last_four')} #{model.get('brand')}"
		else if @isType("bank-account")
			"#{model.get('last_four')} #{model.get('formatted_bank_name')}"
		else
			null
	).property("model.amount_escrowed", "model.amount", "model.display_me", "model.last_four", "model.brand", "model.formatted_bank_name")

	hoverValue: (->
		model = @get("model")
		if @isType("dispute", "reversal", "refund", "credit", "debit", "hold", "order")
			date = model.get("created_at")
			"Created at #{Utils.humanReadableDateShort(date)}"
		else if @isType("customer")
			model.get("display_me_with_email")
		else if @isType("card")
			"#{model.get('last_four')} #{model.get('brand')} (#{model.get('type_name')})"
		else if @isType("bank-account")
			"#{model.get('last_four')} #{model.get('formatted_bank_name')} (#{model.get('type_name')})"
		else
			null
	).property("model.created_at", "model.display_me_with_email", "model.last_four", "model.brand", "model.type_name", "model.formatted_bank_name")

	isType: (typeNames...) ->
		if @get("model")
			modelConstructor = @get("model").constructor
			container = @get("container")

			return typeNames.any (typeName) =>
				type = container.lookupFactory("model:#{typeName}")
				modelConstructor == type
		else
			return false
)

`export default ResourceSummaryBase;`
