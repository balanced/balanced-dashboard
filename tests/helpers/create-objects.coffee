`import Models from "./models";`

Ember.Test.registerAsyncHelper "startMarketplace", (app, Testing) ->
	andThen ->
		Testing.setupMarketplace(app)

Ember.Test.registerAsyncHelper "createBankAccount", (app, Testing) ->
	andThen ->
		instance = Models.BankAccount.create({
			uri: '/customers/' + Testing.CUSTOMER_ID + '/bank_accounts',
			name: 'Test Account',
			account_number: '1234',
			routing_number: '122242607',
			type: 'checking'
		})
		instance.save()
			.then((bankAccount) ->
				Testing.BANK_ACCOUNT_ID = bankAccount.get('id')
				Testing.BANK_ACCOUNT_ROUTE = "#{Testing.MARKETPLACE_ROUTE}/bank_accounts/#{bankAccount.get("id")}"
				return bankAccount
			)

`export default {};`
