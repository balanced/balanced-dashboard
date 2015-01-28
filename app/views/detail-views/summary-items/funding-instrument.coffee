`import Base from "./base";`

FundingInstrument = Base.extend(
	isLoading: Ember.computed.reads("model.isLoading")
	isLink: true

	isBlank: Ember.computed.empty("model")
	isCard: Ember.computed.equal("routeName", "cards")

	text: Ember.computed.reads("model.description")
	hoverValue: Ember.computed("text", "model.type_name", ->
		"#{@get("text")} (#{@get("model.type_name")})"
	)

	lastFour: Ember.computed.reads("model.last_four")
	company: Ember.computed "isCard", "model.brand", "model.formatted_bank_name", ->
		if @get("isCard")
			return @get("model.brand")
		else
			return @get("model.formatted_bank_name")
)

`export default FundingInstrument;`
