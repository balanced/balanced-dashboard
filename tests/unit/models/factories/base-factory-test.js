import BaseFactory from "balanced-dashboard/models/factories/base";

module("Factory - BaseFactory");

test("setValidationErrorsFromServer", function() {
	var subject = BaseFactory.create({});
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
	deepEqual(messages, [
		"phone_number \"99.99\" is not an E.164 formatted phone number",
		"honorific Doctor Parrot is not a real doctor"
	]);
	messages = subject.get("validationErrors.honorific.fullMessages");
	deepEqual(messages, [
		"Doctor Parrot is not a real doctor"
	]);
});
