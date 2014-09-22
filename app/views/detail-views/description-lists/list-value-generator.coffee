class ListValueGenerator
	@create: ->
		new @

	constructor: ->
		@values = []

	add: (label, fieldName, hrefField) ->
		@values.push(
			label: label,
			fieldName: fieldName,
			hrefField: hrefField
		)
		@

	toProperty: ->
		values = @values
		fieldNames = values.mapBy("fieldName").map (name) ->
			"model.#{name}"
		fieldNames.push("model")

		method = Ember.computed(->
			return values.map (value) =>
				if Ember.isBlank(value.hrefField)
					@getKeyValueView(value.label, value.fieldName)
				else
					@getLinkedKeyValueView(value.label, value.fieldName, value.hrefField)
		)
		method.property.apply(method, fieldNames)

`export default ListValueGenerator;`
