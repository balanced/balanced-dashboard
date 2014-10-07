import BaseFormFieldView from "./base-form-field";
import Constants from "balanced-dashboard/utils/constants";

var addEmptyField = function(allowEmpty, values) {
	if (allowEmpty) {
		values = [undefined].concat(values);
	}
	return values;
};

var DateSelectFormFieldView = BaseFormFieldView.extend({
	templateName: "form-fields/date-select-form-field",
	optionValuePath: "content.value",
	optionLabelPath: "content.label",

	startYear: 1920,
	endYear: new Date().getFullYear(),

	dateMonths: function() {
		return addEmptyField(this.get("allowEmpty"), Constants.TIME.MONTHS);
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

export default DateSelectFormFieldView;
