module('Balanced.SessionsController', {
	setup: function() {
		var container = new Ember.Container();
		container.register('controller:registration', {});

		this.controller = Balanced.SessionsController.create({
			container: container
		});
	}
});

test("#login", function(assert) {
	var controller = this.controller;

	var guestStub = sinon.stub(Balanced.Auth, "loginGuestUser");
	var loginStub = sinon.stub(Balanced.Auth, "signIn");

	controller.login("some string");
	assert.deepEqual(guestStub.args[0], ["some string"]);

	controller.login({
		email_address: "jim@example.com",
		password: "Super secure password"
	});

	assert.deepEqual(loginStub.args[0], ["jim@example.com", "Super secure password"]);

	guestStub.restore();
	loginStub.restore();
});

test("#nuke", function(assert) {
	var controller = this.controller;
	var stub = sinon.stub(Balanced.Auth, "forgetLogin");
	controller.nuke();
	assert.deepEqual(stub.args[0], []);
});

test("#isUserMissing", function(assert) {
	var controller = this.controller;

	controller.set("currentUser", undefined);
	assert.ok(controller.get("isUserMissing"), "User is missing when user is undefined");

	controller.set("currentUser", Ember.Object.create());
	assert.ok(!controller.get("isUserMissing"), "User is not missing when user is an object");
});

test("#isUserRegistered", function(assert) {
	var controller = this.controller;

	controller.setProperties({
		currentUser: null,
		isUserGuest: null
	});

	assert.ok(!controller.get("isUserRegistered"), "User is not registered when values are not defined");

	controller.setProperties({
		currentUser: Ember.Object.create(),
		isUserGuest: true
	});
	assert.ok(!controller.get("isUserRegistered"), "User is not registered when isUserGuest");

	controller.setProperties({
		currentUser: Ember.Object.create(),
		isUserGuest: false
	});
	assert.ok(controller.get("isUserRegistered"), "User is registered when it's present and not a guest");
});
