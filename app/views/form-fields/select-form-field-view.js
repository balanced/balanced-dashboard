import BaseFormFieldView from "./base-form-field";

var SelectFormFieldView = BaseFormFieldView.extend({
	templateName: "form_fields/select_form_field",
	optionValuePath: "content.value",
	optionLabelPath: "content.label"
});

export default SelectFormFieldView;
