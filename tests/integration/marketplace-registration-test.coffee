`import startApp from '../helpers/start-app';`
`import fixturesAdapter from "../helpers/fixtures-adapter";`
`import sinonRestore from "../helpers/sinon-restore";`
`import Testing from "../helpers/testing";`

`import helpers from "../helpers/helpers";`
`import checkElements from "../helpers/check-elements";`

App = undefined
Auth = undefined

module 'Integration - Marketplace Registration',
	setup: ->
		App = startApp(ADAPTER: fixturesAdapter)
		Auth = App.__container__.lookup("auth:main")
	teardown: ->
		sinonRestore(Auth.request, $.getScript)
		Ember.run(App, "destroy")


test "complete flow", ->
	visit(Testing.MARKETPLACES_ROUTE)
		.click(".mp-register a:contains(Register)")
		.fillForm("#apiKeyCreate",
			person_name: "Test Person"
			dobYear: "1990"
			dobMonth: "12"
			person_postal_code: "90210"
			person_ssn_last_4: "1111"
			merchant_phone_number: "200-200-2000"
		)
		.click("#apiKeyCreate button:contains(Continue)")
		.checkElements(
			"#marketplaceCreate .notification-center": "Business information confirmed"
		)
		.fillForm("#marketplaceCreate",
			name: "Example marketplace"
			domain_url: "marketplace.example.com"
			support_email_address: "marketplace@example.com"
			support_phone_number: "200-200-2000"
		)
		.click("#marketplaceCreate .checkbox label")
		.click("#marketplaceCreate button:contains(Continue)")
#		.checkElements(
#			"#marketplaceBankAccountCreate .notification-center": "Marketplace created. API key: ak-prod-2xxxxxxxxxxxxxxxxxxxxxxxxx"
#			"#marketplaceBankAccountCreate h3:first": "Step 3 of 3: Add your bank account"
#		)
