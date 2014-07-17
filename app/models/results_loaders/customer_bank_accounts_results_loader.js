Balanced.CustomerBankAccountsResultsLoader = Balanced.ResultsLoader.extend({
	resultsType: Balanced.BankAccount,
	path: Ember.computed.oneWay("customer.bank_accounts_uri")
});
