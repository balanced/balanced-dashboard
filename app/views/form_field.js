Balanced.BaseFormFieldView = Balanced.View.extend({
	layoutName: "form_fields/form_field_layout",
	templateName: "form_fields/base_form_field",
	classNameBindings: [":form-group", "isError:has-error"],

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
	}.property("errorMessages.length"),

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
