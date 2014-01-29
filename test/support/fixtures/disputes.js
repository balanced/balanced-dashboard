Balanced.Adapter.addFixtures([{
	"customers": [{
		"name": "William Henry Cavendish III",
		"links": {
			"source": null,
			"destination": null
		},
		"updated_at": "2013-11-08T19:07:25.432960Z",
		"created_at": "2013-11-08T19:07:25.221430Z",
		"dob_month": 2,
		"id": "CU1BD7AWUgJdo3fiilJRbzy",
		"phone": "+16505551212",
		"href": "/customers/CU1BD7AWUgJdo3fiilJRbzy",
		"merchant_status": "underwritten",
		"meta": {},
		"dob_year": 1947,
		"address": {
			"city": "Nowhere",
			"line2": null,
			"line1": null,
			"state": null,
			"postal_code": "90210",
			"country_code": "USA"
		},
		"business_name": null,
		"ssn_last4": "xxxx",
		"email": "whc@example.org",
		"ein": null
	}],
	"links": {
		"customers.source": "/resources/{customers.source}",
		"customers.card_holds": "/customers/{customers.id}/card_holds",
		"customers.bank_accounts": "/customers/{customers.id}/bank_accounts",
		"customers.debits": "/customers/{customers.id}/debits",
		"customers.destination": "/resources/{customers.destination}",
		"customers.cards": "/customers/{customers.id}/cards",
		"customers.transactions": "/customers/{customers.id}/transactions",
		"customers.refunds": "/customers/{customers.id}/refunds",
		"customers.reversals": "/customers/{customers.id}/reversals",
		"customers.orders": "/customers/{customers.id}/orders",
		"customers.credits": "/customers/{customers.id}/credits"
	},
	"uri": "/customers/CU1BD7AWUgJdo3fiilJRbzy"
}, {
	"disputes": [{
		"status": "lost",
		"links": {
			"transaction": "WDcc8RvoDbRgnozg9lfz6AD"
		},
		"respond_by": "2013-12-11T00:00:00Z",
		"updated_at": "2013-12-06T01:53:16.804700Z",
		"created_at": "2013-12-06T01:53:16.804683Z",
		"reason": "technical",
		"id": "DT2cada9485e1911e39ca9026ba7cd33d0",
		"currency": "USD",
		"amount": 163064,
		"meta": {},
		"href": "/disputes/DT2cada9485e1911e39ca9026ba7cd33d0",
		"initiated_at": "2013-11-05T00:00:00Z"
	}],
	"uri": "/disputes/DT2cada9485e1911e39ca9026ba7cd33d0",
	"links": {
		"disputes.transaction": "/debits/{disputes.transaction}"
	}
}, {
	"debits": [{
		"status": "succeeded",
		"description": "Brand New Electric Guitar Rosewood Fingerboard Sunset Red",
		"links": {
			"customer": "CU1BD7AWUgJdo3fiilJRbzy",
			"source": "CC8FOHTHCqgUyqldD4fgMrI",
			"order": null
		},
		"updated_at": "2013-11-08T19:07:35.667311Z",
		"created_at": "2013-11-08T19:07:34.634336Z",
		"transaction_number": "W774-850-8654",
		"failure_reason": null,
		"currency": "USD",
		"amount": 1330,
		"failure_reason_code": null,
		"meta": {},
		"href": "/debits/WDcc8RvoDbRgnozg9lfz6AD",
		"appears_on_statement_as": "BAL*example.com",
		"id": "WDcc8RvoDbRgnozg9lfz6AD"
	}],
	"links": {
		"debits.source": "/resources/{debits.source}",
		"debits.customer": "/customers/{debits.customer}",
		"debits.order": "/orders/{debits.order}",
		"debits.refunds": "/debits/{debits.id}/refunds",
		"debits.events": "/debits/{debits.id}/events"
	},
	"uri": "/debits/WDcc8RvoDbRgnozg9lfz6AD"
}, {
	"meta": {
		"last": "/debits/WDcc8RvoDbRgnozg9lfz6AD/refunds?limit=10&offset=0",
		"next": null,
		"href": "/debits/WDcc8RvoDbRgnozg9lfz6AD/refunds?limit=10&offset=0",
		"limit": 10,
		"offset": 0,
		"previous": null,
		"total": 0,
		"first": "/debits/WDcc8RvoDbRgnozg9lfz6AD/refunds?limit=10&offset=0"
	},
	"links": {},
	"uri": "/debits/WDcc8RvoDbRgnozg9lfz6AD/refunds"
}, {
	"cards": [{
		"cvv_match": "yes",
		"links": {
			"customer": "CU1BD7AWUgJdo3fiilJRbzy"
		},
		"name": "Jocelyn Bell Burnell",
		"expiration_year": 2015,
		"avs_street_match": null,
		"is_verified": true,
		"created_at": "2013-11-08T19:07:31.531094Z",
		"cvv_result": "Match",
		"brand": "American Express",
		"number": "xxxxxxxxxxx0005",
		"updated_at": "2013-11-08T19:07:32.101077Z",
		"id": "CC8FOHTHCqgUyqldD4fgMrI",
		"expiration_month": 11,
		"cvv": "xxx",
		"meta": {},
		"href": "/cards/CC8FOHTHCqgUyqldD4fgMrI",
		"address": {
			"city": null,
			"line2": null,
			"line1": null,
			"state": null,
			"postal_code": null,
			"country_code": null
		},
		"fingerprint": "dd12e47f63884d25aa5de1fa577783a96440745a8530b5e89670b267838f4960",
		"avs_postal_match": null,
		"avs_result": null
	}],
	"links": {
		"cards.card_holds": "/cards/{cards.id}/card_holds",
		"cards.customer": "/customers/{cards.customer}",
		"cards.debits": "/cards/{cards.id}/debits"
	},
	"uri": "/resources/CC8FOHTHCqgUyqldD4fgMrI"
}, {
	"meta": {
		"last": "/debits/WDcc8RvoDbRgnozg9lfz6AD/events?limit=10&offset=0",
		"next": null,
		"href": "/debits/WDcc8RvoDbRgnozg9lfz6AD/events?limit=10&offset=0",
		"limit": 10,
		"offset": 0,
		"previous": null,
		"total": 2,
		"first": "/debits/WDcc8RvoDbRgnozg9lfz6AD/events?limit=10&offset=0"
	},
	"events": [{
		"links": {},
		"occurred_at": "2013-11-08T19:07:35.667000Z",
		"entity": {
			"invoice_uri": null,
			"precog_uri": "/v2/identities/ID04ca5a8c48a911e384bc026ba7cd33d0/cards/CC0478126848a911e3864a026ba7d31e6f/debits/DE06f6a48248a911e38410026ba7cd33d0",
			"meta": {},
			"id": "WDcc8RvoDbRgnozg9lfz6AD",
			"fee": null,
			"amount": 1330,
			"account_name": "Jocelyn Bell Burnell",
			"customer_uri": "/v1/customers/CU8WL8lOFkpHKtGhpTlav3i",
			"appears_on_statement_as": "example.com",
			"available_at": "2013-11-08T19:07:35.468809Z",
			"status": "succeeded",
			"_type": "debit",
			"description": "Brand New Electric Guitar Rosewood Fingerboard Sunset Red",
			"source_uri": "/v1/marketplaces/TEST-MP1AHUrQdpGutQmJWfcu9YQ/accounts/CU8WL8lOFkpHKtGhpTlav3i/cards/CC8FOHTHCqgUyqldD4fgMrI",
			"events_uri": "/v1/debits/WDcc8RvoDbRgnozg9lfz6AD/events",
			"_uris": {
				"hold_uri": {
					"_type": "hold",
					"key": "hold"
				},
				"refunds_uri": {
					"_type": "page",
					"key": "refunds"
				},
				"events_uri": {
					"_type": "page",
					"key": "events"
				}
			},
			"hold_uri": "/v1/marketplaces/TEST-MP1AHUrQdpGutQmJWfcu9YQ/holds/HLca1sPPPKNbwLDqmMXuRGL",
			"created_at": "2013-11-08T19:07:34.634336Z",
			"uri": "/v1/marketplaces/TEST-MP1AHUrQdpGutQmJWfcu9YQ/debits/WDcc8RvoDbRgnozg9lfz6AD",
			"refunds_uri": "/v1/marketplaces/TEST-MP1AHUrQdpGutQmJWfcu9YQ/debits/WDcc8RvoDbRgnozg9lfz6AD/refunds",
			"transaction_number": "W774-850-8654",
			"account_email_address": null,
			"account_uri": "/v1/marketplaces/TEST-MP1AHUrQdpGutQmJWfcu9YQ/accounts/CU8WL8lOFkpHKtGhpTlav3i",
			"on_behalf_of_uri": null
		},
		"href": "/events/EV06d743f848a911e3b80b026ba7d31e6f",
		"callback_statuses": {
			"failed": 0,
			"retrying": 0,
			"succeeded": 0,
			"pending": 0
		},
		"type": "debit.created",
		"id": "EV06d743f848a911e3b80b026ba7d31e6f"
	}, {
		"links": {},
		"occurred_at": "2013-11-08T19:07:35.667000Z",
		"entity": {
			"invoice_uri": null,
			"precog_uri": "/v2/identities/ID04ca5a8c48a911e384bc026ba7cd33d0/cards/CC0478126848a911e3864a026ba7d31e6f/debits/DE06f6a48248a911e38410026ba7cd33d0",
			"meta": {},
			"id": "WDcc8RvoDbRgnozg9lfz6AD",
			"fee": null,
			"amount": 1330,
			"account_name": "Jocelyn Bell Burnell",
			"customer_uri": "/v1/customers/CU8WL8lOFkpHKtGhpTlav3i",
			"appears_on_statement_as": "example.com",
			"available_at": "2013-11-08T19:07:35.468809Z",
			"status": "succeeded",
			"_type": "debit",
			"description": "Brand New Electric Guitar Rosewood Fingerboard Sunset Red",
			"source_uri": "/v1/marketplaces/TEST-MP1AHUrQdpGutQmJWfcu9YQ/accounts/CU8WL8lOFkpHKtGhpTlav3i/cards/CC8FOHTHCqgUyqldD4fgMrI",
			"events_uri": "/v1/debits/WDcc8RvoDbRgnozg9lfz6AD/events",
			"_uris": {
				"hold_uri": {
					"_type": "hold",
					"key": "hold"
				},
				"refunds_uri": {
					"_type": "page",
					"key": "refunds"
				},
				"events_uri": {
					"_type": "page",
					"key": "events"
				}
			},
			"hold_uri": "/v1/marketplaces/TEST-MP1AHUrQdpGutQmJWfcu9YQ/holds/HLca1sPPPKNbwLDqmMXuRGL",
			"created_at": "2013-11-08T19:07:34.634336Z",
			"uri": "/v1/marketplaces/TEST-MP1AHUrQdpGutQmJWfcu9YQ/debits/WDcc8RvoDbRgnozg9lfz6AD",
			"refunds_uri": "/v1/marketplaces/TEST-MP1AHUrQdpGutQmJWfcu9YQ/debits/WDcc8RvoDbRgnozg9lfz6AD/refunds",
			"transaction_number": "W774-850-8654",
			"account_email_address": null,
			"account_uri": "/v1/marketplaces/TEST-MP1AHUrQdpGutQmJWfcu9YQ/accounts/CU8WL8lOFkpHKtGhpTlav3i",
			"on_behalf_of_uri": null
		},
		"href": "/events/EV0775b8ee48a911e399ca026ba7c1aba6",
		"callback_statuses": {
			"failed": 0,
			"retrying": 0,
			"succeeded": 0,
			"pending": 0
		},
		"type": "debit.succeeded",
		"id": "EV0775b8ee48a911e399ca026ba7c1aba6"
	}],
	"links": {
		"events.callbacks": "/events/{events.self}/callbacks"
	},
	"uri": "/debits/WDcc8RvoDbRgnozg9lfz6AD/events"
}, {
	"meta": {
		"last": "/disputes/DT2cada9485e1911e39ca9026ba7cd33d0/events?limit=10&offset=0",
		"next": null,
		"href": "/disputes/DT2cada9485e1911e39ca9026ba7cd33d0/events?limit=10&offset=0",
		"limit": 10,
		"offset": 0,
		"previous": null,
		"total": 2,
		"first": "/disputes/DT2cada9485e1911e39ca9026ba7cd33d0/events?limit=10&offset=0"
	},
	"events": [{
		"links": {},
		"occurred_at": "2013-11-08T19:07:35.667000Z",
		"entity": {
			"invoice_uri": null,
			"precog_uri": "/v2/identities/ID04ca5a8c48a911e384bc026ba7cd33d0/cards/CC0478126848a911e3864a026ba7d31e6f/debits/DE06f6a48248a911e38410026ba7cd33d0",
			"meta": {},
			"id": "WDcc8RvoDbRgnozg9lfz6AD",
			"fee": null,
			"amount": 1330,
			"account_name": "Jocelyn Bell Burnell",
			"customer_uri": "/v1/customers/CU8WL8lOFkpHKtGhpTlav3i",
			"appears_on_statement_as": "example.com",
			"available_at": "2013-11-08T19:07:35.468809Z",
			"status": "succeeded",
			"_type": "debit",
			"description": "Brand New Electric Guitar Rosewood Fingerboard Sunset Red",
			"source_uri": "/v1/marketplaces/TEST-MP1AHUrQdpGutQmJWfcu9YQ/accounts/CU8WL8lOFkpHKtGhpTlav3i/cards/CC8FOHTHCqgUyqldD4fgMrI",
			"events_uri": "/v1/disputes/DT2cada9485e1911e39ca9026ba7cd33d0/events",
			"_uris": {
				"hold_uri": {
					"_type": "hold",
					"key": "hold"
				},
				"refunds_uri": {
					"_type": "page",
					"key": "refunds"
				},
				"events_uri": {
					"_type": "page",
					"key": "events"
				}
			},
			"hold_uri": "/v1/marketplaces/TEST-MP1AHUrQdpGutQmJWfcu9YQ/holds/HLca1sPPPKNbwLDqmMXuRGL",
			"created_at": "2013-11-08T19:07:34.634336Z",
			"uri": "/v1/marketplaces/TEST-MP1AHUrQdpGutQmJWfcu9YQ/debits/WDcc8RvoDbRgnozg9lfz6AD",
			"refunds_uri": "/v1/marketplaces/TEST-MP1AHUrQdpGutQmJWfcu9YQ/debits/WDcc8RvoDbRgnozg9lfz6AD/refunds",
			"transaction_number": "W774-850-8654",
			"account_email_address": null,
			"account_uri": "/v1/marketplaces/TEST-MP1AHUrQdpGutQmJWfcu9YQ/accounts/CU8WL8lOFkpHKtGhpTlav3i",
			"on_behalf_of_uri": null
		},
		"href": "/events/EV06d743f848a911e3b80b026ba7d31e6f",
		"callback_statuses": {
			"failed": 0,
			"retrying": 0,
			"succeeded": 0,
			"pending": 0
		},
		"type": "dispute.created",
		"id": "EV06d743f848a911e3b80b026ba7d31e6f"
	}, {
		"links": {},
		"occurred_at": "2013-11-08T19:07:35.667000Z",
		"entity": {
			"invoice_uri": null,
			"precog_uri": "/v2/identities/ID04ca5a8c48a911e384bc026ba7cd33d0/cards/CC0478126848a911e3864a026ba7d31e6f/debits/DE06f6a48248a911e38410026ba7cd33d0",
			"meta": {},
			"id": "WDcc8RvoDbRgnozg9lfz6AD",
			"fee": null,
			"amount": 1330,
			"account_name": "Jocelyn Bell Burnell",
			"customer_uri": "/v1/customers/CU8WL8lOFkpHKtGhpTlav3i",
			"appears_on_statement_as": "example.com",
			"available_at": "2013-11-08T19:07:35.468809Z",
			"status": "succeeded",
			"_type": "debit",
			"description": "Brand New Electric Guitar Rosewood Fingerboard Sunset Red",
			"source_uri": "/v1/marketplaces/TEST-MP1AHUrQdpGutQmJWfcu9YQ/accounts/CU8WL8lOFkpHKtGhpTlav3i/cards/CC8FOHTHCqgUyqldD4fgMrI",
			"events_uri": "/v1/disputes/DT2cada9485e1911e39ca9026ba7cd33d0/events",
			"_uris": {
				"hold_uri": {
					"_type": "hold",
					"key": "hold"
				},
				"refunds_uri": {
					"_type": "page",
					"key": "refunds"
				},
				"events_uri": {
					"_type": "page",
					"key": "events"
				}
			},
			"hold_uri": "/v1/marketplaces/TEST-MP1AHUrQdpGutQmJWfcu9YQ/holds/HLca1sPPPKNbwLDqmMXuRGL",
			"created_at": "2013-11-08T19:07:34.634336Z",
			"uri": "/v1/marketplaces/TEST-MP1AHUrQdpGutQmJWfcu9YQ/debits/WDcc8RvoDbRgnozg9lfz6AD",
			"refunds_uri": "/v1/marketplaces/TEST-MP1AHUrQdpGutQmJWfcu9YQ/debits/WDcc8RvoDbRgnozg9lfz6AD/refunds",
			"transaction_number": "W774-850-8654",
			"account_email_address": null,
			"account_uri": "/v1/marketplaces/TEST-MP1AHUrQdpGutQmJWfcu9YQ/accounts/CU8WL8lOFkpHKtGhpTlav3i",
			"on_behalf_of_uri": null
		},
		"href": "/events/EV0775b8ee48a911e399ca026ba7c1aba6",
		"callback_statuses": {
			"failed": 0,
			"retrying": 0,
			"succeeded": 0,
			"pending": 0
		},
		"type": "dispute.succeeded",
		"id": "EV0775b8ee48a911e399ca026ba7c1aba6"
	}],
	"links": {
		"events.callbacks": "/events/{events.self}/callbacks"
	},
	"uri": "/disputes/WDcc8RvoDbRgnozg9lfz6AD/events"
}, {
	"disputes": [{
		"status": "lost",
		"links": {
			"transaction": "WDcc8RvoDbRgnozg9lfz6AD"
		},
		"respond_by": "2013-12-11T00:00:00Z",
		"updated_at": "2013-12-06T01:53:16.804700Z",
		"created_at": "2013-12-06T01:53:16.804683Z",
		"reason": "technical",
		"id": "DT2cada9485e1911e39ca9026ba7cd33d0",
		"currency": "USD",
		"amount": 163064,
		"meta": {},
		"href": "/disputes/DT2cada9485e1911e39ca9026ba7cd33d0",
		"initiated_at": "2013-11-05T00:00:00Z"
	}],
	"meta": {
		"last": "/disputes?limit=50&offset=0",
		"next": null,
		"href": "/disputes?limit=50&offset=0",
		"limit": 50,
		"offset": 0,
		"previous": null,
		"total": 1,
		"first": "/disputes?limit=50&offset=0"
	},
	"links": {
		"disputes.transaction": "/debits/{disputes.transaction}"
	},
	"uri": "/disputes"
}, {
	"uri": "/marketplaces/TEST-MP4cOZZqeAelhxXQzljLLtgl/search?limit=50&offset=0&q=&sort=created_at%2Cdesc&type%5Bin%5D=debit%2Ccredit%2Chold%2Crefund"
}, {
	"uri": "/customers/CU1BD7AWUgJdo3fiilJRbzy/bank_accounts"
}]);
