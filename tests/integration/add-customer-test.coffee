`import startApp from '../helpers/start-app';`
`import Testing from "../helpers/testing";`

`import checkElements from "../helpers/check-elements";`
`import helpers from "../helpers/helpers";`

`import Customer from "balanced-dashboard/models/customer";`

App = undefined
Adapter = undefined

visitAddACustomerModal = ->
	route = Testing.MARKETPLACE_ROUTE + "/customers"
	selector = ".page-navigation a:contains(Add a customer)"

	visit(route).click(selector)

module 'Integration - AddCustomer',
	setup: ->
		App = startApp()
		Adapter = App.__container__.lookup("adapter:main")
		Testing.setupMarketplace()
	teardown: ->
		Testing.restoreMethods(Adapter.create)
		Ember.run(App, 'destroy')

test 'can visit page', ->
	visitAddACustomerModal()
		.checkText("#add-customer h2", "Add a customer")

test 'can create person customer', ->
	spy = sinon.spy(Adapter, "create")

	visitAddACustomerModal()
		.fillForm('#add-customer',
			name: 'TEST',
			email: 'nick@example.com',
			address_line1: '1234 main street',
			address_line2: 'Ste 400',
			address_city: 'oakland',
			address_state: 'ca',
			address_postal_code: '94612',
			phone: '1231231234',
			dob_month: '12',
			dob_year: '1930',
			ssn_last4: '1234',
			meta_facebook: 'kleinsch',
			meta_twitter: 'kleinsch',
			country_code: "US"
		)
		.click('button[name=modal-submit]')
		.then ->
			args = spy.firstCall.args
			ok(spy.calledOnce)
			equal(args[0], Customer)
			deepEqual(args[1], "/customers")
			matchesProperties(args[2].address,
				city: "oakland"
				country_code: "US"
				line1: "1234 main street"
				line2: "Ste 400"
				postal_code: "94612"
				state: "ca"
			)
			matchesProperties(args[2].meta,
				facebook: "kleinsch"
				twitter: "kleinsch"
			)
			matchesProperties(args[2],
				dob_month: "12"
				dob_year: "1930"
				email: "nick@example.com"
				name: 'TEST'
				phone: "1231231234"
				ssn_last4: "1234"
			)

test 'can create business customer', ->
	spy = sinon.spy(Adapter, "create")
	visitAddACustomerModal()
		.fillForm('#add-customer',
			business_name: 'Something Inc'
			ein: '123123123'
			name: 'TEST'
			email: 'nick@example.com'
			address_line1: '1234 main street'
			address_line2: 'Ste 200'
			address_city: 'oakland'
			address_state: 'ca'
			address_postal_code: '94612'
			phone: '1231231234'
			dob_month: '12'
			dob_year: '1930'
			ssn_last4: '1234'
			meta_facebook: 'kleinsch'
			meta_twitter: 'kleinsch'
			country_code: "US"
		)
		.click('button[name=modal-submit]')
		.then ->
			args = spy.firstCall.args
			ok(spy.calledOnce)
			equal(args[0], Customer)
			deepEqual(args[1], "/customers")
			matchesProperties(args[2],
				name: "TEST"
				business_name: "Something Inc"
				dob_month: "12"
				dob_year: "1930"
				ein: "123123123"
				email: "nick@example.com"
				ssn_last4: "1234"
				phone: "1231231234"
			)
			matchesProperties(args[2].meta,
				facebook: "kleinsch"
				twitter: "kleinsch"
			)
			matchesProperties(args[2].address,
				city: "oakland"
				line1: "1234 main street"
				line2: "Ste 200"
				postal_code: "94612"
				state: "ca"
			)
