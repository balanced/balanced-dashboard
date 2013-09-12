module('Balanced.Rev1Serializer');

var marketplaceJson = {
	"marketplaces": [{
		"in_escrow": 0,
		"domain_url": "example.com",
		"name": "Test Marketplace",
		"links": {
			"owner_customer": "CU1XSPjcwGw7h279IMxptENX"
		},
		"href": "/marketplaces/TEST-MP1XQLiGuuKx5kaIgsRPjQyZ",
		"created_at": "2013-09-29T02:17:12.922491Z",
		"support_email_address": "support@example.com",
		"updated_at": "2013-09-29T02:17:13.553008Z",
		"support_phone_number": "+16505551234",
		"production": false,
		"meta": {},
		"unsettled_fees": 0,
		"id": "TEST-MP1XQLiGuuKx5kaIgsRPjQyZ"
	}],
	"links": {
		"marketplaces.debits": "/debits",
		"marketplaces.reversals": "/reversals",
		"marketplaces.customers": "/customers",
		"marketplaces.credits": "/credits",
		"marketplaces.cards": "/cards",
		"marketplaces.card_holds": "/card_holds",
		"marketplaces.refunds": "/refunds",
		"marketplaces.owner_customer": "/customers/{marketplaces.owner_customer}",
		"marketplaces.transactions": "/transactions",
		"marketplaces.bank_accounts": "/bank_accounts",
		"marketplaces.callbacks": "/callbacks",
		"marketplaces.events": "/events"
	}
};

test('Can extractSingle marketplace', function(assert) {
	var serializer = Balanced.Rev1Serializer.create();

	var extracted = serializer.extractSingle(marketplaceJson, '/marketplaces/TEST-MP1XQLiGuuKx5kaIgsRPjQyZ', Balanced.Marketplace);
	assert.equal(extracted.name, "Test Marketplace");
	assert.equal(extracted.transactions_uri, "/transactions");
	assert.equal(extracted.owner_customer_uri, "/customers/CU1XSPjcwGw7h279IMxptENX");
});

test('Can extractSingle new marketplace', function(assert) {
	var serializer = Balanced.Rev1Serializer.create();

	var extracted = serializer.extractSingle(marketplaceJson, null, Balanced.Marketplace);
	assert.equal(extracted.name, "Test Marketplace");
	assert.equal(extracted.transactions_uri, "/transactions");
	assert.equal(extracted.owner_customer_uri, "/customers/CU1XSPjcwGw7h279IMxptENX");
});
