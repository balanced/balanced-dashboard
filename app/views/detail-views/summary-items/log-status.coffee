`import Base from "./base-status";`

LogStatus = Base.extend(
	text: Ember.computed.reads("model.status_code"),
	description: Ember.computed.reads("model.additional"),
	status: Ember.computed.reads("model.status"),
)

`export default LogStatus;`
