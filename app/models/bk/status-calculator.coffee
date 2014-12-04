`import Ember from "ember";`

StatusCalculator = Ember.Object.extend(
	label: "Loading"

	#[loading success info warning danger]
	alertType: "loading"

	info: (value, label="Information") ->
		@setProperties(
			alertType: "info"
			label: label
			value: value
		)

	success: (value, label="Success") ->
		@setProperties(
			alertType: "success"
			label: label
			value: value
		)

	error: (value, label="Error") ->
		@setProperties(
			alertType: "danger"
			label: label
			value: value
		)

	warning: (value, label="Warning") ->
		@setProperties(
			alertType: "warning"
			label: label
			value: value
		)
)

`export default StatusCalculator;`
