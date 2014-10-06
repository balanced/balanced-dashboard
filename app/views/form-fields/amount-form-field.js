import BaseFormFieldView from './base-form-field';

var AmountFormFieldView = BaseFormFieldView.extend({
	templateName: "form-fields/amount-form-field",
	inputName: "dollar_amount"
});

export default AmountFormFieldView;
