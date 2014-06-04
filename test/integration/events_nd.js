module('Events', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createDebit();
		Testing.createCustomer();
		Testing.createCredit();
		Testing.setupEvent();
	},
	teardown: function() {}
});

test('can visit page', function(assert) {
	var elements = {
		'.event-info dl dt': 4,
		'.event-info dl dd': 4,
		'.prettyprint': {
			count: 1,
			classNames: 'lang-js',
			hasText: true
		},
		'.event-data-info h3': 'Event data',
		'.webhook-info h3': 'Webhooks'
	};

	visit(Testing.EVENT_ROUTE)
		.checkElements(elements, assert);
});
