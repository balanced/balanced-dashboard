export default [{
	"marketplaces": [{
		"in_escrow": 0,
		"domain_url": "example.com",
		"name": "FIXTURED Marketplace",
		"links": {
			"owner_customer": "CU1BD7AWUgJdo3fiilJRbzy"
		},
		"href": "/marketplaces/FIXTURED-MP4cOZZqeAelhxXQzljLLtgl",
		"created_at": "2013-11-06T23:52:48.396506Z",
		"support_email_address": "support@example.com",
		"updated_at": "2013-11-06T23:52:48.812549Z",
		"support_phone_number": "+16505551234",
		"production": true,
		"meta": {},
		"unsettled_fees": 0,
		"id": "FIXTURED-MP4cOZZqeAelhxXQzljLLtgl"
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
		"marketplaces.events": "/events",
		"marketplaces.disputes": "/disputes"
	},
	"uri": "/marketplaces/FIXTURED-MP4cOZZqeAelhxXQzljLLtgl",
}, {
	"uri": "/customers/search?limit=10&sort=created_at%2Cdesc&type%5Bin%5D=card%2Cbank_account"
}];
