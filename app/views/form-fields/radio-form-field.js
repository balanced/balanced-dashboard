import BaseFormFieldView from './base-form-field';

var RadioFormFieldView = BaseFormFieldView.extend({
	templateName: "form-fields/radio-form-field",
	inputName: "radio",

	// updateParentValue: function() {
	// 	var value = this.get("value");
	// 	console.log(this.getProperties("value", "model", "fieldName"))
	// 	this.get("model").set(this.get("fieldName"), value);
	// }.observes("value", "model", "fieldName"),
});

export default RadioFormFieldView;
