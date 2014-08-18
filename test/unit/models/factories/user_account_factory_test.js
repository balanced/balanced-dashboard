module("UserAccountFactory");

test("#handleErrorResponse", function(assert) {
	var subject = Balanced.UserAccountFactory.create();

	subject.handleErrorResponse({
		email_address: ["Enter a valid e-mail address."]
	});

	var errors = subject.get("validationErrors.allMessages");

	assert.deepEqual(errors, [
		[
			"email_address", "Enter a valid e-mail address."
		]
	]);
});
