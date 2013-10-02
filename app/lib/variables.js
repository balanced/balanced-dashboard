Balanced.COOKIE = {
	// cookies set by the Ember dashboard app
	EMBER_AUTH_TOKEN: 'ember-auth-rememberable',
	MARKETPLACE_URI: 'mru',
	API_KEY_SECRET: 'apiKeySecret',

	// read only (set by the auth proxy)
	CSRF_TOKEN: 'csrftoken',
	SESSION: 'session'
};

Balanced.TIME = {
	THREE_YEARS: 365 * 3
};

Balanced.KEYS = {
	ENTER: 13,
	ESCAPE: 27
};

Balanced.BANK_ACCOUNT_TYPES = [{
	label: 'Checking',
	value: 'checking'
}, {
	label: 'Savings',
	value: 'savings'
}];

Balanced.SEARCH = {
	CATEGORIES: ['transaction', 'customer', 'funding_instrument'],
	TRANSACTION_TYPES: ['debit', 'credit', 'hold', 'refund'],
	FUNDING_INSTRUMENT_TYPES: ['bank_account', 'card']
};

//  time in ms to throttle between key presses for search
Balanced.THROTTLE = 400;

Balanced.PASSWORD = {
	MIN_CHARS: 6,
	REGEX: /(?=.*[A-z])(?=.*\d)/
};

Balanced.MAXLENGTH = {
	DESCRIPTION: 150,
	APPEARS_ON_STATEMENT_BANK_ACCOUNT: 14,
	APPEARS_ON_STATEMENT_CARD: 18
};
