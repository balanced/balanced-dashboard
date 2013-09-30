Balanced.Adapter.addFixtures([{
	"customer": {
		"twitter": null,
		"meta": {},
		"id": "CU5HNpzy2ASiIAlPGowxM8ku",
		"email": null,
		"_type": "customer",
		"source_uri": "/v1/customers/CU5HNpzy2ASiIAlPGowxM8ku/cards/CC7eEaykBs8vYCpqI1srg87o",
		"reversals_uri": "/v1/customers/CU5HNpzy2ASiIAlPGowxM8ku/reversals",
		"phone": null,
		"merchant_uri": null,
		"facebook": null,
		"address": {},
		"destination_uri": "/v1/customers/CU5HNpzy2ASiIAlPGowxM8ku/bank_accounts/BAUAraFOuPa9W0nWGkw58ej",
		"business_name": null,
		"bank_accounts_uri": "/v1/customers/CU5HNpzy2ASiIAlPGowxM8ku/bank_accounts",
		"credits_uri": "/v1/customers/CU5HNpzy2ASiIAlPGowxM8ku/credits",
		"cards_uri": "/v1/customers/CU5HNpzy2ASiIAlPGowxM8ku/cards",
		"holds_uri": "/v1/customers/CU5HNpzy2ASiIAlPGowxM8ku/holds",
		"name": "jimbo",
		"dob": null,
		"created_at": "2013-08-13T20:48:39.556Z",
		"is_identity_verified": false,
		"uri": "/v1/customers/CU5HNpzy2ASiIAlPGowxM8ku",
		"refunds_uri": "/v1/customers/CU5HNpzy2ASiIAlPGowxM8ku/refunds",
		"_uris": {
			"holds_uri": {
				"_type": "page",
				"key": "holds"
			},
			"source_uri": {
				"_type": "card",
				"key": "source"
			},
			"bank_accounts_uri": {
				"_type": "page",
				"key": "bank_accounts"
			},
			"refunds_uri": {
				"_type": "page",
				"key": "refunds"
			},
			"debits_uri": {
				"_type": "page",
				"key": "debits"
			},
			"destination_uri": {
				"_type": "bank_account",
				"key": "destination"
			},
			"transactions_uri": {
				"_type": "page",
				"key": "transactions"
			},
			"reversals_uri": {
				"_type": "page",
				"key": "reversals"
			},
			"credits_uri": {
				"_type": "page",
				"key": "credits"
			},
			"cards_uri": {
				"_type": "page",
				"key": "cards"
			}
		},
		"debits_uri": "/v1/customers/CU5HNpzy2ASiIAlPGowxM8ku/debits",
		"transactions_uri": "/v1/customers/CU5HNpzy2ASiIAlPGowxM8ku/transactions",
		"ssn_last4": null,
		"ein": null
	},
	"_type": "hold",
	"fee": null,
	"description": "test hold",
	"_uris": {
		"events_uri": {
			"_type": "page",
			"key": "events"
		}
	},
	"transaction_number": "HL722-853-7086",
	"created_at": "2013-08-21T22:33:25.382Z",
	"uri": "/v1/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/holds/HL5oPyl3e5QKjtMdbsnLhYpy",
	"expires_at": "2030-08-28T22:33:25.022Z",
	"account_name": "jimbo",
	"source": {
		"_type": "card",
		"expiration_month": 3,
		"precog_uri": "/v2/identities/IDbb9aca7e045911e38e65026ba7d31e6f/cards/CCcb7531be045911e39bbe026ba7cd33d0",
		"meta": {},
		"postal_code": null,
		"country_code": null,
		"id": "CC6cr3CM4Q88ExBsbgtucBg6",
		"postal_code_check": "true",
		"is_valid": true,
		"customer_uri": "/v1/customers/CU5HNpzy2ASiIAlPGowxM8ku",
		"is_verified": true,
		"security_code_check": "true",
		"can_hold": true,
		"hash": "8d82d600be0925b12d820c770edb00c525eefd942a0f53cb79957fb3add86e30",
		"iin_uri": "/v1/cards/CC6cr3CM4Q88ExBsbgtucBg6/iin",
		"brand": "American Express",
		"default_debit": false,
		"_uris": {
			"iin_uri": {
				"_type": "iin",
				"key": "iin"
			},
			"transactions_uri": {
				"_type": "page",
				"key": "transactions"
			},
			"account_uri": {
				"_type": "customer",
				"key": "account"
			}
		},
		"last_four": "0005",
		"default_credit": false,
		"can_debit": true,
		"transactions_uri": "/v1/cards/CC6cr3CM4Q88ExBsbgtucBg6/transactions",
		"name": "test",
		"expiration_year": 2017,
		"can_credit": false,
		"created_at": "2013-08-13T20:49:06.809Z",
		"uri": "/v1/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/accounts/CU5HNpzy2ASiIAlPGowxM8ku/cards/CC6cr3CM4Q88ExBsbgtucBg6",
		"card_type": "amex",
		"account_uri": "/v1/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/accounts/CU5HNpzy2ASiIAlPGowxM8ku",
		"street_address": null
	},
	"amount": 4200,
	"meta": {},
	"is_void": false,
	"events_uri": "/v1/holds/HL5oPyl3e5QKjtMdbsnLhYpy/events",
	"debit": null,
	"account": {
		"customer_uri": "/v1/customers/CU5HNpzy2ASiIAlPGowxM8ku",
		"_type": "account",
		"transactions_uri": "/v1/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/accounts/CU5HNpzy2ASiIAlPGowxM8ku/transactions",
		"name": "jimbo",
		"roles": ["buyer"],
		"created_at": "2013-08-13T20:48:39.556Z",
		"uri": "/v1/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/accounts/CU5HNpzy2ASiIAlPGowxM8ku",
		"bank_accounts_uri": "/v1/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/accounts/CU5HNpzy2ASiIAlPGowxM8ku/bank_accounts",
		"refunds_uri": "/v1/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/accounts/CU5HNpzy2ASiIAlPGowxM8ku/refunds",
		"merchant_uri": null,
		"_uris": {
			"transactions_uri": {
				"_type": "page",
				"key": "transactions"
			},
			"bank_accounts_uri": {
				"_type": "page",
				"key": "bank_accounts"
			},
			"refunds_uri": {
				"_type": "page",
				"key": "refunds"
			},
			"customer_uri": {
				"_type": "customer",
				"key": "customer"
			},
			"debits_uri": {
				"_type": "page",
				"key": "debits"
			},
			"holds_uri": {
				"_type": "page",
				"key": "holds"
			},
			"reversals_uri": {
				"_type": "page",
				"key": "reversals"
			},
			"credits_uri": {
				"_type": "page",
				"key": "credits"
			},
			"cards_uri": {
				"_type": "page",
				"key": "cards"
			}
		},
		"meta": {},
		"debits_uri": "/v1/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/accounts/CU5HNpzy2ASiIAlPGowxM8ku/debits",
		"holds_uri": "/v1/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/accounts/CU5HNpzy2ASiIAlPGowxM8ku/holds",
		"reversals_uri": "/v1/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/accounts/CU5HNpzy2ASiIAlPGowxM8ku/reversals",
		"email_address": null,
		"id": "CU5HNpzy2ASiIAlPGowxM8ku",
		"credits_uri": "/v1/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/accounts/CU5HNpzy2ASiIAlPGowxM8ku/credits",
		"cards_uri": "/v1/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/accounts/CU5HNpzy2ASiIAlPGowxM8ku/cards"
	},
	"account_email_address": null,
	"id": "HL5oPyl3e5QKjtMdbsnLhYpy"
}]);
