`import FormattedInputComponent from "./formatted-input";`

defineFormat = (regexp, value) ->
	object = {}
	object[regexp] = value
	return object

FormattedMonthYearInputComponent = FormattedInputComponent.extend(
	format: [
		defineFormat("^[2-9]", "0{{9}} / {{9999}}")
		defineFormat("*", "{{99}} / {{9999}}")
	]
	placeholder: "MM / YYYY"
)

`export default FormattedMonthYearInputComponent;`
