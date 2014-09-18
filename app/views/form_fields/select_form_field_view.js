import BaseFormFieldView from "./base_form_field";

var SelectFormFieldView = BaseFormFieldView.extend({
	templateName: "form_fields/select_form_field",
	optionValuePath: "content.value",
	optionLabelPath: "content.label"
});

export default SelectFormFieldView;
