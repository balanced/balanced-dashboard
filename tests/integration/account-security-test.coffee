`import startApp from '../helpers/start-app';`
`import fixturesAdapter from "../helpers/fixtures-adapter";`
`import sinonRestore from "../helpers/sinon-restore";`
`import Testing from "../helpers/testing";`

`import helpers from "../helpers/helpers";`
`import checkElements from "../helpers/check-elements";`

App = undefined
Auth = undefined

module 'Integration - Account Security',
	setup: ->
		App = startApp(ADAPTER: fixturesAdapter)
		Auth = App.__container__.lookup("auth:main")
	teardown: ->
		sinonRestore(Auth.request, $.getScript)
		Ember.run(App, "destroy")

test 'Can enable', ->
	getScript = sinon.stub($, "getScript").returns(Ember.RSVP.resolve())
	Auth.get("user").set("uri", "/user")
	spy = sinon.stub(Auth, 'request')

	spy.onCall(0).returns Ember.RSVP.resolve(
		id: "USxxxxxxxxxxxxxxx"
		secret: "VERYSECRET"
		secret_uri: "otpauth://xxxxxxxxxxxxxxxxxxxxxxx"
	)
	spy.onCall(1).returns Ember.RSVP.resolve(
		detail: "You need to pass in a confirm token to continue login"
	)

	visit(Testing.MARKETPLACES_ROUTE)
		.click("#user-menu a:contains(Enable two-factor authentication)")
		.check("#enable-auth h2", "Enable two-factor authentication")
		.fillForm("#enable-auth",
			auth_code: "111222"
		)
		.click('#enable-auth button[name=modal-submit]')
		.then( ->
			deepEqual(spy.args, [
				[
					url: "https://auth.balancedpayments.com/users/USeb4a5d6ca6ed11e2bea6026ba7db2987/otp"
					type: "POST"
				],
				[
					data:
						confirm: "111222"
					dataType: "JSON"
					type: "PUT"
					url: "https://auth.balancedpayments.comhttps://auth.balancedpayments.com/logins/current"
				]
			])
		)

test 'Can disable', ->
	spy = sinon.stub(Auth, 'request').returns(Ember.RSVP.resolve())
	Auth.set('user.otp_enabled', true)

	visit(Testing.MARKETPLACES_ROUTE)
		.click("#user-menu a:contains(Disable two-factor authentication)")
		.checkText("#disable-auth h2", "Disable two-factor authentication")
		.click('#disable-auth button[name=modal-submit]')
		.then(->
			equal(spy.callCount, 1, 'Disabled')
		)
