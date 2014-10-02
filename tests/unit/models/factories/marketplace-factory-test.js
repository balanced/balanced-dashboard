import MarketplaceFactory from "balanced-dashboard/models/factories/marketplace-factory";
import startApp from '../../../helpers/start-app';
import Testing from "../../../helpers/testing";

import checkElements from "../../../helpers/check-elements";
import createObjects from "../../../helpers/create-objects";
import helpers from "../../../helpers/helpers";

import Models from "../../../helpers/models";

var App, Adapter;

module("Factory - MarketplaceFactory", {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
	},
	teardown: function() {
		Testing.restoreMethods(jQuery.ajax);
		Ember.run(App, "destroy");
	}
});


test("validations", function() {
	var factory = MarketplaceFactory.create();
	factory.validate();

	deepEqual(factory.get("validationErrors.fullMessages"), [
		"isTermsAccepted must be checked",
		"name can't be blank",
		"support_email_address can't be blank",
		"support_phone_number can't be blank",
		"domain_url can't be blank"
	]);

	factory = MarketplaceFactory.create({
		isTermsAccepted: true,
		name: "Cool Marketplace",
		support_phone_number: "3903.333333"
	});
	factory.validate();
	deepEqual(factory.get("validationErrors.fullMessages"), [
		"support_email_address can't be blank",
		'support_phone_number has invalid characters (only "+", "-", "(", ")" spaces and numbers are accepted)',
		"domain_url can't be blank"
	]);
});


test("#getPostAttributes", function() {
	var subject = MarketplaceFactory.create({
		isTermsAccepted: true,
		domain_url: "http://www.example.org",
		name: "Cool Marketplace",
		support_email_address: "email@example.org",
		support_phone_number: "123-333-3333",
	});

	deepEqual(subject.getPostAttributes(), {
		domain_url: "http://www.example.org",
		name: "Cool Marketplace",
		support_email_address: "email@example.org",
		support_phone_number: "123-333-3333",
	});
});

test("#handleResponse", function() {
	var subject = MarketplaceFactory.create();
	var result = subject.handleResponse({
		marketplaces: [{
			href: "/marketplace/:some_id"
		}]
	});
	deepEqual(result, "/marketplace/:some_id");
});

test("#_save", function() {
	expect(1);
	var stub = sinon.stub(jQuery, "ajax").returns(Ember.RSVP.resolve({
		marketplaces: []
	}));
	var subject = MarketplaceFactory.create({
		domain_url: "http://www.example.org",
		name: "Cool Marketplace",
		support_email_address: "email@example.org",
		support_phone_number: "123-333-3333",
	});

	subject._save();
	andThen(function() {
		deepEqual(JSON.parse(stub.args[0][0].data), {
			domain_url: "http://www.example.org",
			name: "Cool Marketplace",
			support_email_address: "email@example.org",
			support_phone_number: "123-333-3333",
		});
	});
});
