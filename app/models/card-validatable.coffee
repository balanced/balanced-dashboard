`import Card from "./card";`
`import FundingInstrumentValidatable from "./mixins/funding-instrument-validatable";`

CardValidatable = Card.extend(Ember.Validations, FundingInstrumentValidatable,
	getTokenizingResponseHref: (response) ->
		response.cards[0].href
	getTokenizingObject: ->
		balanced.card
	getTokenizingData: ->
		number: @get('number'),
		expiration_month: @get('expiration_month'),
		expiration_year: @get('expiration_year'),
		cvv: @get('cvv'),
		name: @get('name'),
		address: @get('address') || {}
)

`export default CardValidatable;`
