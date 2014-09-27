import BaseFormFieldView from "./base-form-field";

var SelectFormFieldView = BaseFormFieldView.extend({
	templateName: "form-fields/select-form-field",
	optionValuePath: "content.value",
	optionLabelPath: "content.label"
});

export default SelectFormFieldView;
