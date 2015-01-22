`import BaseFormField from "./base-form-field";`

CreditCardNumberFormFieldView =  BaseFormField.extend(
	attributeBindings: ['placeholder', 'autofocus']
	templateName: "formFields/credit-card-number-form-field"
)

`export default CreditCardNumberFormFieldView;`
