`import BaseFormField from "./base-form-field";`

CreditCardFormFieldView =  BaseFormField.extend(
	attributeBindings: ['placeholder', 'autofocus']
	templateName: "formFields/credit-card-form-field"
)

`export default CreditCardFormFieldView;`
