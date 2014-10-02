import UserAccountFactory from "balanced-dashboard/models/factories/user-account-factory";
import startApp from '../../../helpers/start-app';
import Testing from "../../../helpers/testing";

import checkElements from "../../../helpers/check-elements";
import createObjects from "../../../helpers/create-objects";
import helpers from "../../../helpers/helpers";

import Models from "../../../helpers/models";

var App, Adapter;


module("Factory - UserAccountFactory", {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
	},
	teardown: function() {
		Testing.restoreMethods(jQuery.ajax);
		Ember.run(App, "destroy");
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
	var stub = sinon.stub(jQuery, "ajax").returns(Ember.RSVP.resolve({
		users: []
	}));

	var userAccount = UserAccountFactory.create({
		email_address: "jimmy@example.com",
		password: "secrutPassword",
		passwordConfirm: "secrutPassword"
	});

	userAccount._save();
	var request = stub.args[0][0];

	andThen(function() {
		deepEqual(request.data, {
			email_address: "jimmy@example.com",
			password: "secrutPassword",
			passwordConfirm: "secrutPassword"
		});
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
