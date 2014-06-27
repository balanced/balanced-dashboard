Balanced.COOKIE = {
	// cookies set by the Ember dashboard app
	EMBER_AUTH_TOKEN: 'ember-auth-rememberable',
	MARKETPLACE_URI: 'mru',
	API_KEY_SECRET: 'apiKeySecret',
	NEW_UPDATES: 'new-updates',
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
	SEARCH_TYPES: ['debit', 'credit', 'card_hold', 'refund', "reversal"],
	TRANSACTION_TYPES: ['debit', 'credit', 'hold', 'refund'],
	FUNDING_INSTRUMENT_TYPES: ['bank_account', 'card'],
	DISPUTE_TYPES: ['pending', 'won', 'lost', 'arbitration']
};

//  time in ms to throttle between key presses for search
Balanced.THROTTLE = {
	SEARCH: 400,
	REFRESH: 1000
};

Balanced.PASSWORD = {
	MIN_CHARS: 6,
	REGEX: /(?=.*[A-z])(?=.*\d)/
};

Balanced.MAXLENGTH = {
	DESCRIPTION: 150,
	APPEARS_ON_STATEMENT_BANK_ACCOUNT: 14,
	APPEARS_ON_STATEMENT_CARD: 18
};

Balanced.EXPECTED_CREDIT_DAYS_OFFSET = {
	ACH: 1,
	DEBIT_CARD: 2
};

Balanced.DATES = {
	CREATED_AT: moment('2011-04-01').startOf('day').toDate(),

	RESULTS_MAX_TIME: moment().add('hours', 2).startOf('hour').toDate(),
	RESULTS_MIN_TIME: moment().subtract('months', 1).startOf('hour').toDate()
};

Balanced.BANK_NAMES = {
	// formatted : [ unformatted ]
	'': ['Na', ', N.a.', 'N.a.', 'N. a.'],
	'of': ['Of'],
	'and': ['And'],
	'U.S.': ['U.s.'],
	'USAA': ['Usaa'],
	'USA': ['Usa'],
	'National': ['tional'],
	'Credit Union': ['C.u.', 'C.u'],
	'Federal Credit Union': ['F.c.u'],
	'GE': ['Ge'],
	'TD': ['Td'],
	'PNC': ['Pnc'],
	'FSB': ['Fsb'],
	'RBS': ['Rbs'],
	'FIA': ['Fia'],
	'HSBC': ['Hsbc'],
	'J.P. Morgan': ['Jpmorgan', 'J.p. Morgan'],
};
