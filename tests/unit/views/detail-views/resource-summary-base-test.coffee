`import { test, moduleFor } from "ember-qunit";`

moduleFor("view:detail-views/resource-summaries/resource-summary-base", "View - ResourceSummaryBase", {},
	(container) ->
		typeNames = ["dispute", "reversal", "refund", "credit", "debit", "hold", "order", "customer", "card", "bank-account"]
		for typeName in typeNames
			container.register("model:#{typeName}", Ember.Object.extend(), singleton: false, instantiate: true)
)

generateSetModel = (view) ->
	setModel = (modelType, attributes) ->
		Ember.run ->
			model = view.get("container").lookup("model:#{modelType}")
			model.setProperties attributes
			view.set("model", model)

test "#value", ->
	view = @subject()
	setModel = generateSetModel(view)
	executeTest = (expectation) ->
		deepEqual(view.get("value"), expectation)

	executeTest(null)

	setModel("order", amount_escrowed: 1404)
	executeTest("$14.04")
	setModel("debit", amount: 1204)
	executeTest("$12.04")
	setModel("reversal", amount: 12104)
	executeTest("$121.04")
	setModel("customer", display_me: "Cool Customer")
	executeTest("Cool Customer")
	setModel("card",
		last_four: "9999"
		brand: "Visa"
	)
	executeTest("9999 Visa")
	setModel("bank-account",
		last_four: "9011"
		formatted_bank_name: "First Bank of Banking"
	)
	executeTest("9011 First Bank of Banking")

test "#hoverValue", ->
	view = @subject()

	setModel = generateSetModel(view)

	executeTest = (expectation) ->
		deepEqual(view.get("hoverValue"), expectation)

	executeTest null

	setModel "dispute", created_at: "2014-12-18T19:12:24.373Z"
	deepEqual(view.get("hoverValue").replace(/,.*$/, ""),  "Created at 12/18/2014")
	setModel "refund", created_at: "2012-12-10T19:00:24.373Z"
	deepEqual(view.get("hoverValue").replace(/,.*$/, ""),  "Created at 12/10/2012")

	setModel "customer", display_me_with_email: "xxxxxxxxx"
	executeTest "xxxxxxxxx"

	setModel("card",
		last_four: "9999"
		brand: "Visa"
		type_name: "Credit"
	)
	executeTest("9999 Visa (Credit)")
	setModel("bank-account",
		last_four: "9011"
		formatted_bank_name: "First Bank of Banking"
		type_name: "Checking"
	)
	executeTest("9011 First Bank of Banking (Checking)")
