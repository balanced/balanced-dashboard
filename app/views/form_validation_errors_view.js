Balanced.FormValidationErrorsView = Balanced.View.extend({
	templateName: "form_fields/form_validation_errors",
	errorMessages: Ember.computed.oneWay("model.validationErrors.fullMessages"),
});
