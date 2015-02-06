`import Base from "./base-status";`
`import Utils from "balanced-dashboard/lib/utils";`

InvoiceStatus = Base.extend(
	status: Ember.computed.reads("model.state")
	description: Ember.computed "model.settle_at", ->
		return "on #{Utils.humanReadableDateLong(@get('model.settle_at'))}"
)

`export default InvoiceStatus;`
