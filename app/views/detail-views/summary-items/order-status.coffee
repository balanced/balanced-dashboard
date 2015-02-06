`import Base from "./base-status";`

OrderStatus = Base.extend(
	description: Ember.computed("isOverdue", ->
		if @get("isOverdue")
			"Funds in this order are older than 30 days. Pay out your outstanding balance now."
	)
)

`export default OrderStatus;`
