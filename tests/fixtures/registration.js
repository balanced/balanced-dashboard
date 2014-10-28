export default [{
	"uri": "https://api.balancedpayments.com/api_keys",
	"links": {},
	"api_keys": [{
		"links": {},
		"created_at": "2000-10-00T03:00:00.000000Z",
		"secret": "ak-prod-2xxxxxxxxxxxxxxxxxxxxxxxxx",
		"href": "/api_keys/AKxxxxxxxxxxxxxxxxxxxxx",
		"meta": {},
		"id": "AKxxxxxxxxxxxxxx"
	}]
}, {
	"uri": "https://api.balancedpayments.com/marketplaces",
	"marketplaces": [
		{
		"in_escrow": 0,
		"domain_url": "marketplace.example.com",
		"name": "Example marketplace",
		"links": {
			"owner_customer": "CUxxxxxxxxxxxxxxxxxxx"
		},
		"href": "/marketplaces/MPxxxxxxxxxxxxxxxxxx",
		"created_at": "2000-10-00T03:00:00.000000Z",
		"support_email_address": "carlosrr@gmail.com",
		"updated_at": "2000-10-00T03:00:00.000000Z",
		"support_phone_number": "+2000000000",
		"production": true,
		"meta": {},
		"unsettled_fees": 0,
		"id": "MPxxxxxxxxxxxxxxxxxx"
	}],
	"links": {
		"marketplaces.debits": "/debits",
		"marketplaces.reversals": "/reversals",
		"marketplaces.disputes": "/disputes",
		"marketplaces.customers": "/customers",
		"marketplaces.credits": "/credits",
		"marketplaces.cards": "/cards",
		"marketplaces.orders": "/orders",
		"marketplaces.card_holds": "/card_holds",
		"marketplaces.refunds": "/refunds",
		"marketplaces.owner_customer": "/customers/{marketplaces.owner_customer}",
		"marketplaces.transactions": "/transactions",
		"marketplaces.bank_accounts": "/bank_accounts",
		"marketplaces.callbacks": "/callbacks",
		"marketplaces.events": "/events"
	}
}, {
	"uri": "http://auth.balancedpayments.com/users/USeb4a5d6ca6ed11e2bea6026ba7db2987/marketplaces",
	"id": "MPxxxxxxxxxxxxxxxxxx",
	"name": "Carlos Marketplace for Ping Pong Products",
	"secret": "ak-prod-2xxxxxxxxxxxxxxxxxxxxxxxxx",
	"keys": [{
		"created_at": "2000-10-00T03:00:00.000000Z",
		"secret": "ak-prod-2xxxxxxxxxxxxxxxxxxxxxxxxx",
		"uri": "/v1/api_keys/AKxxxxxxxxxxxxxx"
	}],
	"revision": "1.1"
}, {
	"marketplaces": [{
		"in_escrow": 0,
		"domain_url": "marketplace.example.com",
		"name": "Example marketplace",
		"links": {
			"owner_customer": "CUxxxxxxxxxxxxxxxxxxx"
		},
		"href": "/marketplaces/MPxxxxxxxxxxxxxxxxxx",
		"created_at": "2000-10-00T03:00:00.000000Z",
		"support_email_address": "pingpong@example.com",
		"updated_at": "2000-10-00T03:00:00.000000Z",
		"support_phone_number": "+2000000000",
		"production": true,
		"meta": {},
		"unsettled_fees": 0,
		"id": "MPxxxxxxxxxxxxxxxxxx"
	}],
	"uri": "/marketplaces/MPxxxxxxxxxxxxxxxxxx",
	"links": {
		"marketplaces.debits": "/debits",
		"marketplaces.reversals": "/reversals",
		"marketplaces.disputes": "/disputes",
		"marketplaces.customers": "/customers",
		"marketplaces.credits": "/credits",
		"marketplaces.cards": "/cards",
		"marketplaces.orders": "/orders",
		"marketplaces.card_holds": "/card_holds",
		"marketplaces.refunds": "/refunds",
		"marketplaces.owner_customer": "/customers/{marketplaces.owner_customer}",
		"marketplaces.transactions": "/transactions",
		"marketplaces.bank_accounts": "/bank_accounts",
		"marketplaces.callbacks": "/callbacks",
		"marketplaces.events": "/events"
	}
}];
