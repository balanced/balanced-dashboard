import UserAccountFactory from "balanced-dashboard/models/factories/user-account-factory";
import BaseConnection from "balanced-dashboard/lib/connections/base-connection";

var Adapter;

module("Factory - UserAccountFactory", {
	setup: function() {
		Adapter = BaseConnection.ADAPTER = {
			load: sinon.stub()
		};
	}
});

test("#setValidationErrorsFromServer", function() {
	var subject = UserAccountFactory.create();

	subject.setValidationErrorsFromServer({
		email_address: ["Enter a valid e-mail address."]
	});

	var errors = subject.get("validationErrors.allMessages");

	deepEqual(errors, [
		[
			"email_address", "Enter a valid e-mail address."
		]
	]);
});

test("#_save", function() {
	expect(1);
	var stub = Adapter.load;

	var userAccount = UserAccountFactory.create({
		email_address: "jimmy@example.com",
		password: "secrutPassword",
		passwordConfirm: "secrutPassword"
	});

	userAccount._save();
	var request = stub.args[0][0];

	deepEqual(request.data, {
		email_address: "jimmy@example.com",
		password: "secrutPassword",
		passwordConfirm: "secrutPassword"
	});
});

test("#getPostAttributes", function() {
	var userAccount = UserAccountFactory.create({
		email_address: "jimmy@example.com",
		password: "secrutPassword",
		passwordConfirm: "secrutPassword",
		name: "Rob",
		lastName: "Grape"
	});

	deepEqual(userAccount.getPostAttributes(), {
		email_address: "jimmy@example.com",
		password: "secrutPassword",
		passwordConfirm: "secrutPassword"
	});
});

test("#handleResponse", function() {
	var userAccount = UserAccountFactory.create();

	deepEqual(userAccount.handleResponse({
		uri: "/users/:id"
	}), "/users/:id");
});
