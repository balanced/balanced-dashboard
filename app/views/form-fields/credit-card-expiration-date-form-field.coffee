`import BaseFormField from "./base-form-field";`

CreditCardExpirationDateFormFieldView =  BaseFormField.extend(
	attributeBindings: ['placeholder', 'autofocus']
	templateName: "form-fields/credit-card-expiration-date-form-field"
)

`export default CreditCardExpirationDateFormFieldView;`
