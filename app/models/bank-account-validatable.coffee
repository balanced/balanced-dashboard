`import BankAccount from "./bank-account";`
`import FundingInstrumentValidatable from "./mixins/funding-instrument-validatable";`

BankAccountValidatable = BankAccount.extend(Ember.Validations, FundingInstrumentValidatable,
	getTokenizingResponseHref: (response) ->
		response.bank_accounts[0].href
	getTokenizingObject: ->
		balanced.bankAccount
	getTokenizingData: ->
		account_type: @get('account_type')
		name: @get('name')
		account_number: $.trim(@get('account_number'))
		routing_number: $.trim(@get('routing_number'))
)

`export default BankAccountValidatable;`
