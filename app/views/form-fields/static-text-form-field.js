import BaseFormFieldView from './base-form-field';

var StaticTextFormFieldView = BaseFormFieldView.extend({
	templateName: "form-fields/static-text-form-field",
	emptyText: "none",
	value: ""
});

export default StaticTextFormFieldView;
