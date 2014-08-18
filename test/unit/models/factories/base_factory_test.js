module("BaseFactory");

test("setValidationErrorsFromServer", function(assert) {
	var subject = Balanced.BaseFactory.create({});
	subject.validate();

	subject.setValidationErrorsFromServer({
		errors: [{
			"description": "Invalid field merchant[phone_number] - \"99.99\" is not an E.164 formatted phone number",
			"extras": {
				"phone_number": "\"99.99\" is not an E.164 formatted phone number"
			},
		}, {
			"description": "Invalid field merchant[honorific] - Doctor Parrot is not a real doctor.",
			"extras": {
				"honorific": "Doctor Parrot is not a real doctor"
			},
		}]
	});

	var messages = subject.get("validationErrors.fullMessages");
	assert.deepEqual(messages, [
		"\"99.99\" is not an E.164 formatted phone number",
		"Doctor Parrot is not a real doctor."
	]);
	messages = subject.get("validationErrors.honorific.fullMessages");
	assert.deepEqual(messages, [
		"Doctor Parrot is not a real doctor."
	]);
});
