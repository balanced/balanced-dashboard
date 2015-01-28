`import Ember from "ember";`
`import Base from "./base";`

computedContains = (arrayName, valueName) ->
	return Ember.computed(arrayName, valueName, ->
		@get(arrayName).contains @get(valueName)
	)

BaseStatus = Base.extend(
	classNameBindings: [":status", "isSuccess:succeeded", "isError:failed", "isOverdue:overdue", "isWarning:pending", "isUnderReview:under_review"]

	isDescription: Ember.computed("description", ->
		!Ember.isBlank(@get("description"))
	)

	isLoading: Ember.computed.reads("model.isLoading")
	isBlank: Ember.computed.empty("model.status")

	text: Ember.computed("status", ->
		@get("status").replace(/_/g, " ").capitalize()
	)
	status: Ember.computed.reads("model.status")
	description: Ember.computed.reads("model.status_description")

	successValues: ["active", "succeeded", "captured", "verified", "paid"]
	isSuccess: computedContains("successValues", "status")

	errorValues: ["failed", "error"]
	isError: computedContains("errorValues", "status")

	overdueValues: ["overdue"]
	isOverdue: computedContains("overdueValues", "status")

	warningValues: ["unverified", "pending", "needs_attention"]
	isWarning: computedContains("warningValues", "status")

	underReviewValues: ["under_review"]
	isUnderReview: computedContains("underReviewValues", "status")
)

`export default BaseStatus;`
