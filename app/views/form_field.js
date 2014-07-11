Balanced.BaseFormFieldView = Balanced.View.extend({
	layoutName: "form_fields/form_field_layout",
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
	}.property("errorMessages.length")
});

Balanced.TextFormFieldView = Balanced.BaseFormFieldView.extend({
	templateName: "form_fields/text_form_field",
});

Balanced.SelectFormFieldView = Balanced.BaseFormFieldView.extend({
	templateName: "form_fields/select_form_field",
	optionValuePath: "content.value",
	optionLabelPath: "content.label"
});

var addEmptyField = function(allowEmpty, values) {
	if (allowEmpty) {
		values = [undefined].concat(values);
	}
	return values;
};

Balanced.DateFormFieldView = Balanced.BaseFormFieldView.extend({
	templateName: "form_fields/date_form_field",
	optionValuePath: "content.value",
	optionLabelPath: "content.label",

	startYear: 1920,
	endYear: new Date().getFullYear(),

	dateMonths: function() {
		return addEmptyField(this.get("allowEmpty"), Balanced.TIME.MONTHS);
	}.property("allowEmpty"),
	dateYears: function() {
		var startYear = this.get("startYear");
		var endYear = this.get("endYear");

		var difference = endYear - startYear;
		var values = _.times(difference, function(i) {
			return endYear - i;
		});

		return addEmptyField(this.get("allowEmpty"), values);
	}.property("allowEmpty", "startYear", "endYear"),

	updateValue: function() {
		var month = this.get("month");
		var year = this.get("year");
		var value = "";

		if (month || year) {
			month = "00" + month;
			value = "%@-%@".fmt(this.get("year"), month.slice(-2));
		}
		return this.set("value", value);
	}.observes("month", "year"),

	value: function(a, value) {
		if (arguments.length > 1) {
			this.setModelValue(value);
		}
		return this.getModelValue();
	}.property("model", "field"),
});
