import UserAccountFactory from "balanced-dashboard/models/factories/user-account-factory";

module("UserAccountFactory");

test("#setValidationErrorsFromServer", function(assert) {
	var subject = UserAccountFactory.create();

	subject.setValidationErrorsFromServer({
		email_address: ["Enter a valid e-mail address."]
	});

	var errors = subject.get("validationErrors.allMessages");

	assert.deepEqual(errors, [
		[
			"email_address", "Enter a valid e-mail address."
		]
	]);
});

test("#_save", function(assert) {
	var stub = sinon.stub(jQuery, "ajax");
	stub.returns({
		then: function() {}
	});

	var userAccount = UserAccountFactory.create({
		email_address: "jimmy@example.com",
		password: "secrutPassword",
		passwordConfirm: "secrutPassword"
	});

	userAccount._save();
	var request = stub.args[0][0];
	assert.deepEqual(request.data, {
		email_address: "jimmy@example.com",
		password: "secrutPassword",
		passwordConfirm: "secrutPassword"
	});

	stub.restore();
});

test("#getPostAttributes", function(assert) {
	var userAccount = UserAccountFactory.create({
		email_address: "jimmy@example.com",
		password: "secrutPassword",
		passwordConfirm: "secrutPassword",
		name: "Rob",
		lastName: "Grape"
	});

	assert.deepEqual(userAccount.getPostAttributes(), {
		email_address: "jimmy@example.com",
		password: "secrutPassword",
		passwordConfirm: "secrutPassword"
	});
});

test("#handleResponse", function(assert) {
	var userAccount = UserAccountFactory.create();

	assert.deepEqual(userAccount.handleResponse({
		uri: "/users/:id"
	}), "/users/:id");
});
