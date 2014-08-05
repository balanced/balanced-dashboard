module("MarketplaceFactory");

test("validations", function(assert) {
	var factory = Balanced.MarketplaceFactory.create();
	factory.validate();
	var errors = factory.get("validationErrors.fullMessages");
	assert.deepEqual(errors, [
		"name must be present",
		"support_email_address must be present",
		"support_phone_number must be present",
		"domain_url must be present"
	]);
});
