`import OtpLogin from "balanced-dashboard/models/otp-login";`

module "Model - OtpLogin"

test "#submitRequest", ->
	auth = Ember.Object.create(
		lastLoginUri: "/login/xxxxx"
		request: sinon.spy()
	)
	container = new Ember.Container()
	container.register("auth:main", auth,
		singleton: true
		instantiate: false
	)

	subject = OtpLogin.create(
		container: container
		otpCode: "xxxxxx"
	)

	subject.submitRequest()
	deepEqual(auth.request.args, [[{
		dataType: "JSON"
		url: "https://auth.balancedpayments.com/login/xxxxx"
		type: "PUT"
		data:
			confirm: "xxxxxx"
	}]])

test "validations", ->
	s = OtpLogin.create()
	s.validate()
	deepEqual(s.get("validationErrors.fullMessages"), [
		"otpCode can't be blank"
	])

	s.set("otpCode", "3030")
	s.validate()
	deepEqual(s.get("validationErrors.fullMessages"), [])

test "#save (invalid)", ->
	spy = sinon.stub()
	s = OtpLogin.create()

	Ember.run ->
		s.save().then(undefined, spy)

	deepEqual(spy.callCount, 1)
	deepEqual(s.get("validationErrors.fullMessages"), [
		"otpCode can't be blank"
	])

test "#save (valid)", ->
	auth = Ember.Object.create(
		request: sinon.stub()
	)
	auth.request.returns Ember.RSVP.resolve(
		user:
			email_address: "cool@example.com"
	)

	container = new Ember.Container()
	container.register("auth:main", auth,
		singleton: true
		instantiate: false
	)

	subject = OtpLogin.create(
		container: container
		path: "/login/xxxxx"
		otpCode: "xxxxxx"
	)
	session = undefined

	Ember.run ->
		subject.save().then (s) ->
			session = s

	deepEqual(session.get("user.email_address"), "cool@example.com")
