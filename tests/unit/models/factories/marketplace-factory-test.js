import startApp from '../../../helpers/start-app';
import MarketplaceFactory from "balanced-dashboard/models/factories/marketplace-factory";
import BaseConnection from "balanced-dashboard/lib/connections/base-connection";

module("Factory - MarketplaceFactory");

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
	var subject = MarketplaceFactory.create({
		domain_url: "http://www.example.org",
		name: "Cool Marketplace",
		support_email_address: "email@example.org",
		support_phone_number: "123-333-3333",
	});
	var connection = subject.getConnection();
	var stub = sinon.stub(connection, "createMarketplace");

	subject._save();
	deepEqual(stub.args[0][0], {
		domain_url: "http://www.example.org",
		name: "Cool Marketplace",
		support_email_address: "email@example.org",
		support_phone_number: "123-333-3333",
	});
});
