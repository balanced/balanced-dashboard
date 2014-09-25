import MarketplaceFactory from "balanced-dashboard/models/factories/marketplace-factory";

module("MarketplaceFactory");

test("validations", function(assert) {
	var factory = MarketplaceFactory.create();
	factory.validate();

	assert.deepEqual(factory.get("validationErrors.fullMessages"), [
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
	assert.deepEqual(factory.get("validationErrors.fullMessages"), [
		"support_email_address can't be blank",
		'support_phone_number has invalid characters (only "+", "-", "(", ")" spaces and numbers are accepted)',
		"domain_url can't be blank"
	]);
});


test("#getPostAttributes", function(assert) {
	var subject = MarketplaceFactory.create({
		isTermsAccepted: true,
		domain_url: "http://www.example.org",
		name: "Cool Marketplace",
		support_email_address: "email@example.org",
		support_phone_number: "123-333-3333",
	});

	assert.deepEqual(subject.getPostAttributes(), {
		domain_url: "http://www.example.org",
		name: "Cool Marketplace",
		support_email_address: "email@example.org",
		support_phone_number: "123-333-3333",
	});
});

test("#handleResponse", function(assert) {
	var subject = MarketplaceFactory.create();
	var result = subject.handleResponse({
		marketplaces: [{
			href: "/marketplace/:some_id"
		}]
	});
	assert.deepEqual(result, "/marketplace/:some_id");
});

test("#_save", function(assert) {
	var stub = sinon.stub(jQuery, "ajax");
	stub.returns({
		then: function() {}
	});
	var subject = MarketplaceFactory.create({
		domain_url: "http://www.example.org",
		name: "Cool Marketplace",
		support_email_address: "email@example.org",
		support_phone_number: "123-333-3333",
	});

	subject._save();
	assert.deepEqual(JSON.parse(stub.args[0][0].data), {
		domain_url: "http://www.example.org",
		name: "Cool Marketplace",
		support_email_address: "email@example.org",
		support_phone_number: "123-333-3333",
	});
	stub.restore();
});
