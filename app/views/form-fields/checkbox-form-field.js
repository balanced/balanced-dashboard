import Ember from "ember";

var CheckboxFormFieldView = Ember.View.extend({
	templateName: "form-fields/checkbox-form-field",
	classNameBindings: [":form-group", "isError:has-error", ":checkbox"],
	inputName: function() {
		if (this.get("field")) {
			return this.get("field").replace(/\./g, "_");
		}
	}.property("field"),

	setModelValue: function(value) {
		var model = this.get("model");
		var field = this.get("field");
		return model.set(field, value);
	},

	getModelValue: function() {
		var model = this.get("model");
		var field = this.get("field");
		return model.get(field);
	},

	value: function(a, value) {
		if (arguments.length > 1) {
			this.setModelValue(value);
		}
		return this.getModelValue();
	}.property("model", "field"),

	errorMessages: function() {
		var validationErrors = this.get("model.validationErrors");
		if (validationErrors) {
			var errors = validationErrors.get(this.get("field"));
			if (errors) {
				return errors.get("fullMessages");
			}
		}
		return [];
	}.property("model.validationErrors", "field"),

	isError: function() {
		return this.get("errorMessages.length") > 0;
	}.property("errorMessages.length")
});

export default CheckboxFormFieldView;
