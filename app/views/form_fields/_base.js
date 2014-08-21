Balanced.FormFields = {};

Balanced.BaseFormFieldView = Balanced.View.extend({
	layoutName: "form_fields/form_field_layout",
	templateName: "form_fields/base_form_field",
	classNameBindings: [":form-group", "isError:has-error"],
	inputName: function() {
		return this.get("field").replace(/\./, "_");
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

	getFullErrorMessagesFor: function(fieldName) {
		var propName = "model.validationErrors.%@.fullMessages".fmt(fieldName);
		return this.get(propName) || [];
	},

	errorMessages: function() {
		return this.getFullErrorMessagesFor(this.get("field"));
	}.property("model.validationErrors.allMessages.length"),

	isOneError: Ember.computed.equal("errorMessages.length", 1),

	isError: Ember.computed.gt("errorMessages.length", 0),

	didInsertElement: function() {
		$('.form-group').hover(function(event) {
			$('.alert-error').css('display', 'none');
			$(event.currentTarget).find('.alert-error').css('display', 'inline');
		});

		$('.form-group input').focus(function(event) {
			$('.alert-error').css('display', 'none');
			$(event.currentTarget).parents('.form-group').find('.alert-error').css('display', 'inline');
		});
	}
});
