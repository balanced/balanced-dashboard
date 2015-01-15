`import startApp from '../helpers/start-app';`
`import fixturesAdapter from "../helpers/fixtures-adapter";`
`import sinonRestore from "../helpers/sinon-restore";`
`import Testing from "../helpers/testing";`

`import helpers from "../helpers/helpers";`
`import checkElements from "../helpers/check-elements";`

App = undefined

module 'Integration - Marketplace Registration',
	setup: ->
		App = startApp(ADAPTER: fixturesAdapter)
	teardown: ->
		Ember.run(App, "destroy")

test "complete flow", ->
	apiKey = undefined
	marketplace = undefined
	userMarketplaceController = BalancedApp.__container__.lookup("controller:register-flow/user-marketplace")
	sinon.stub(userMarketplaceController, "addApiKeyToCurrentUserFlow").returns(Ember.RSVP.resolve())

	visit(Testing.MARKETPLACES_ROUTE)
		.click(".mp-register a:contains(Register)")
		.fillForm("#apiKeyCreate",
			businessType: "person"
			personFullName: "Jimmy Business"
			personDateOfBirth: "11/1980"
			personAddressPostalCode: "99900"
			personSsnLast4: "1111"
			personPhoneNumber: "200-200-2000"
		)
		.then(->
			apiKey = BalancedApp.__container__.lookup("controller:modals-container").get("currentModal.model")
			sinon.stub(apiKey, "save").returns(Ember.RSVP.resolve(apiKey))
		)
		.click("#marketplaceCreate [name=isTermsAccepted]")
		.click("#apiKeyCreate [name=modal-submit]")
		.checkElements(
			"#marketplaceCreate .notification-center": "Business information confirmed"
		)
		.fillForm("#marketplaceCreate",
			name: "Example marketplace"
			domainUrl: "marketplace.example.com"
			supportEmailAddress: "marketplace@example.com"
			supportPhoneNumber: "200-200-2000"
		)
		.then(->
			apiKey.set("secret", "ak-test-secretsecret")
			marketplace = BalancedApp.__container__.lookup("controller:modals-container").get("currentModal.marketplace")
			sinon.stub(marketplace, "save").returns(Ember.RSVP.resolve(marketplace))
		)
		.click("#marketplaceCreate [name=modal-submit]")
		.then ->
			deepEqual(marketplace.save.args, [[]])
			deepEqual(apiKey.save.args, [[]])
			deepEqual(userMarketplaceController.addApiKeyToCurrentUserFlow.args, [["ak-test-secretsecret"]])
