class KeyValueGenerator
	@create: ->
		new @

	constructor: ->
		@values = []

	add: (key, value) ->
		@values.push(
			key: key,
			value: value
		)
		@

`export default KeyValueGenerator;`
