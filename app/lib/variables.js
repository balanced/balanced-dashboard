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
	THREE_YEARS: 365 * 3,
	MONTHS: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
	DAYS_IN_MONTH: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
	WEEK: 7
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
	CATEGORIES: ['order', 'transaction', 'search', 'customer', 'funding_instrument', 'dispute'],
	SEARCH_TYPES: ['debit', 'credit', 'card_hold', 'refund'],
	TRANSACTION_TYPES: ['debit', 'credit', 'hold', 'refund'],
	FUNDING_INSTRUMENT_TYPES: ['bank_account', 'card'],
	DISPUTE_TYPES: ['pending', 'won', 'lost']
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
