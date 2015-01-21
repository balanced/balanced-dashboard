`import Ember from "ember";`

FormattedInputComponent = Ember.TextField.extend(
	tagName: "input"

	getFormatterAttributes: ->
		value = @get("format")
		if Ember.typeOf(value) == "array"
			return patterns: value
		else
			return pattern: value

	didInsertElement: ->
		new window.Formatter(@element, @getFormatterAttributes())
)

`export default FormattedInputComponent;`
