Balanced.FormFields.ModalFormFieldView = Balanced.View.extend({
	layoutName: "form_fields/modal_form_field_layout",
	classNameBindings: [":control-group", "isError:error"],

	value: function(a, value) {
		var model = this.get("model");
		var fieldName = this.get("fieldName");
		if (arguments.length > 1) {
			model.set(fieldName, value);
		}
		return model.get(fieldName);
	}.property("model", "fieldName"),
	isError: Ember.computed.gt("errorMessages.length", 0),
	errorMessages: function() {
		var model = this.get("model");
		var fieldName = this.get("fieldName");

		var errorObject = model.get("validationErrors").get(fieldName);

		if (errorObject) {
			return errorObject.get("fullMessages").map(function(m) {
				return fieldName + " " + m;
			});
		}
	}.property("model.validationErrors", "fieldName")
});
