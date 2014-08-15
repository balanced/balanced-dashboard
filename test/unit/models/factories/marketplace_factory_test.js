module("MarketplaceFactory");

test("validations", function(assert) {
	var factory = Balanced.MarketplaceFactory.create();
	factory.validate();
	var errors = factory.get("validationErrors.fullMessages");

	assert.deepEqual(errors, [
		"isTermsAccepted must be checked",
		"name can't be blank",
		"support_email_address can't be blank",
		"support_phone_number can't be blank",
		"domain_url can't be blank"
	]);
});
