Balanced.Adapter.addFixtures([
{
    "_type": "page",
    "_uris": {
        "first_uri": {
            "_type": "page",
            "key": "first"
        },
        "last_uri": {
            "_type": "page",
            "key": "last"
        },
        "next_uri": {
            "_type": "page",
            "key": "next"
        },
        "previous_uri": {
            "_type": "page",
            "key": "previous"
        }
    },
    "first_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/invoices?q=&sort=created_at%2Cdesc&limit=20&offset=0",
    "id": null,
    "items": [
        {
            "_type": "invoice",
            "_uris": {
                "bank_account_debits": {
                    "_type": "page",
                    "key": "bank_account_de"
                },
                "bank_account_debits_uri": {
                    "_type": "page",
                    "key": "bank_account_debits"
                },
                "card_debits": {
                    "_type": "page",
                    "key": "card_de"
                },
                "card_debits_uri": {
                    "_type": "page",
                    "key": "card_debits"
                },
                "credits": {
                    "_type": "page",
                    "key": "cre"
                },
                "credits_uri": {
                    "_type": "page",
                    "key": "credits"
                },
                "debits": {
                    "_type": "page",
                    "key": "de"
                },
                "debits_uri": {
                    "_type": "page",
                    "key": "debits"
                },
                "failed_credits": {
                    "_type": "page",
                    "key": "failed_cre"
                },
                "failed_credits_uri": {
                    "_type": "page",
                    "key": "failed_credits"
                },
                "holds": {
                    "_type": "page",
                    "key": "h"
                },
                "holds_uri": {
                    "_type": "page",
                    "key": "holds"
                },
                "lost_debit_chargebacks": {
                    "_type": "page",
                    "key": "lost_debit_chargeb"
                },
                "lost_debit_chargebacks_uri": {
                    "_type": "page",
                    "key": "lost_debit_chargebacks"
                },
                "refunds": {
                    "_type": "page",
                    "key": "ref"
                },
                "refunds_uri": {
                    "_type": "page",
                    "key": "refunds"
                },
                "reversals": {
                    "_type": "page",
                    "key": "rever"
                },
                "reversals_uri": {
                    "_type": "page",
                    "key": "reversals"
                },
                "settlements": {
                    "_type": "page",
                    "key": "settlem"
                },
                "settlements_uri": {
                    "_type": "page",
                    "key": "settlements"
                }
            },
            "adjustments": [],
            "adjustments_count": 0,
            "adjustments_total_fee": 0,
            "bank_account_debit_variable_fee_cap": null,
            "bank_account_debit_variable_fee_percentage": 1.0,
            "bank_account_debits_count": 0,
            "bank_account_debits_total_amount": 0,
            "bank_account_debits_total_fee": 0,
            "bank_account_debits_uri": "/v1/invoices/IV6jUpqk7IkuH6pyrzumcr9e/bank_account_debits",
            "card_debits_count": 0,
            "card_debits_total_amount": 0,
            "card_debits_total_fee": 0,
            "card_debits_uri": "/v1/invoices/IV6jUpqk7IkuH6pyrzumcr9e/card_debits",
            "chargeback_fixed_fee": 1500,
            "created_at": "2012-12-13T23:07:05.243478Z",
            "credit_fee": 0,
            "credits_count": 0,
            "credits_total_amount": 0,
            "credits_total_fee": 0,
            "credits_uri": "/v1/invoices/IV6jUpqk7IkuH6pyrzumcr9e/credits",
            "debits_count": 0,
            "debits_total_amount": 0,
            "debits_total_fee": 0,
            "debits_uri": "/v1/invoices/IV6jUpqk7IkuH6pyrzumcr9e/card_debits",
            "failed_credit_fee": 0,
            "failed_credits_count": 0,
            "failed_credits_total_amount": 0,
            "failed_credits_total_fee": 0,
            "failed_credits_uri": "/v1/invoices/IV6jUpqk7IkuH6pyrzumcr9e/failed_credits",
            "hold_fee": 35,
            "holds_count": 1,
            "holds_total_amount": 100,
            "holds_total_fee": 35,
            "holds_uri": "/v1/invoices/IV6jUpqk7IkuH6pyrzumcr9e/holds",
            "id": "IV6jUpqk7IkuH6pyrzumcr9e",
            "lost_debit_chargebacks_count": 0,
            "lost_debit_chargebacks_total_amount": 0,
            "lost_debit_chargebacks_total_fee": 0,
            "lost_debit_chargebacks_uri": "/v1/invoices/IV6jUpqk7IkuH6pyrzumcr9e/lost_debit_chargebacks",
            "marketplace_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY",
            "period": [
                "2012-12-07T15:52:09.967097Z",
                "2012-12-07T15:52:09.967097Z"
            ],
            "refund_fee": true,
            "refunds_count": 0,
            "refunds_total_amount": 0,
            "refunds_total_fee": 0,
            "refunds_uri": "/v1/invoices/IV6jUpqk7IkuH6pyrzumcr9e/refunds",
            "reversals_count": 0,
            "reversals_total_amount": 0,
            "reversals_total_fee": 0,
            "reversals_uri": "/v1/invoices/IV6jUpqk7IkuH6pyrzumcr9e/reversals",
            "sequence_number": 2,
            "settle_at": "2012-12-20T21:36:33.034328Z",
            "settlement": {
                "_type": "settlement",
                "_uris": {},
                "amount": 35,
                "created_at": "2013-01-11T02:01:42.785902Z",
                "events_uri": "/v1/settlements/ST6AgOFiIAGWB9aDYBo14RQQ/events",
                "id": "ST6AgOFiIAGWB9aDYBo14RQQ",
                "invoice_uri": "/v1/invoices/IV6jUpqk7IkuH6pyrzumcr9e",
                "marketplace_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY",
                "state": "submitted",
                "updated_at": "2013-01-12T00:38:39.667601Z",
                "uri": "/v1/invoices/IV6jUpqk7IkuH6pyrzumcr9e/settlements/ST6AgOFiIAGWB9aDYBo14RQQ"
            },
            "settlements_uri": "/v1/invoices/IV6jUpqk7IkuH6pyrzumcr9e/settlements",
            "source": null,
            "state": "paid",
            "total_fee": 35,
            "updated_at": "2013-01-11T02:01:42.255514Z",
            "uri": "/v1/invoices/IV6jUpqk7IkuH6pyrzumcr9e",
            "variable_fee_percentage": 3.5
        },
        {
            "_type": "invoice",
            "_uris": {
                "bank_account_debits": {
                    "_type": "page",
                    "key": "bank_account_de"
                },
                "bank_account_debits_uri": {
                    "_type": "page",
                    "key": "bank_account_debits"
                },
                "card_debits": {
                    "_type": "page",
                    "key": "card_de"
                },
                "card_debits_uri": {
                    "_type": "page",
                    "key": "card_debits"
                },
                "credits": {
                    "_type": "page",
                    "key": "cre"
                },
                "credits_uri": {
                    "_type": "page",
                    "key": "credits"
                },
                "debits": {
                    "_type": "page",
                    "key": "de"
                },
                "debits_uri": {
                    "_type": "page",
                    "key": "debits"
                },
                "failed_credits": {
                    "_type": "page",
                    "key": "failed_cre"
                },
                "failed_credits_uri": {
                    "_type": "page",
                    "key": "failed_credits"
                },
                "holds": {
                    "_type": "page",
                    "key": "h"
                },
                "holds_uri": {
                    "_type": "page",
                    "key": "holds"
                },
                "lost_debit_chargebacks": {
                    "_type": "page",
                    "key": "lost_debit_chargeb"
                },
                "lost_debit_chargebacks_uri": {
                    "_type": "page",
                    "key": "lost_debit_chargebacks"
                },
                "refunds": {
                    "_type": "page",
                    "key": "ref"
                },
                "refunds_uri": {
                    "_type": "page",
                    "key": "refunds"
                },
                "reversals": {
                    "_type": "page",
                    "key": "rever"
                },
                "reversals_uri": {
                    "_type": "page",
                    "key": "reversals"
                },
                "settlements": {
                    "_type": "page",
                    "key": "settlem"
                },
                "settlements_uri": {
                    "_type": "page",
                    "key": "settlements"
                }
            },
            "adjustments": [],
            "adjustments_count": 0,
            "adjustments_total_fee": 0,
            "bank_account_debit_variable_fee_cap": null,
            "bank_account_debit_variable_fee_percentage": 1.0,
            "bank_account_debits_count": 0,
            "bank_account_debits_total_amount": 0,
            "bank_account_debits_total_fee": 0,
            "bank_account_debits_uri": "/v1/invoices/IVDOATjeyAPTJMJPnBR83uE/bank_account_debits",
            "card_debits_count": 6,
            "card_debits_total_amount": 7015,
            "card_debits_total_fee": 245,
            "card_debits_uri": "/v1/invoices/IVDOATjeyAPTJMJPnBR83uE/card_debits",
            "chargeback_fixed_fee": 1500,
            "created_at": "2012-12-08T00:34:53.121459Z",
            "credit_fee": 0,
            "credits_count": 0,
            "credits_total_amount": 0,
            "credits_total_fee": 0,
            "credits_uri": "/v1/invoices/IVDOATjeyAPTJMJPnBR83uE/credits",
            "debits_count": 6,
            "debits_total_amount": 7015,
            "debits_total_fee": 245,
            "debits_uri": "/v1/invoices/IVDOATjeyAPTJMJPnBR83uE/card_debits",
            "failed_credit_fee": 0,
            "failed_credits_count": 0,
            "failed_credits_total_amount": 0,
            "failed_credits_total_fee": 0,
            "failed_credits_uri": "/v1/invoices/IVDOATjeyAPTJMJPnBR83uE/failed_credits",
            "hold_fee": 35,
            "holds_count": 51,
            "holds_total_amount": 72160,
            "holds_total_fee": 1785,
            "holds_uri": "/v1/invoices/IVDOATjeyAPTJMJPnBR83uE/holds",
            "id": "IVDOATjeyAPTJMJPnBR83uE",
            "lost_debit_chargebacks_count": 0,
            "lost_debit_chargebacks_total_amount": 0,
            "lost_debit_chargebacks_total_fee": 0,
            "lost_debit_chargebacks_uri": "/v1/invoices/IVDOATjeyAPTJMJPnBR83uE/lost_debit_chargebacks",
            "marketplace_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY",
            "period": [
                "2012-05-24T17:50:00.084673Z",
                "2012-11-27T16:46:15.375576Z"
            ],
            "refund_fee": true,
            "refunds_count": 7,
            "refunds_total_amount": 7015,
            "refunds_total_fee": -245,
            "refunds_uri": "/v1/invoices/IVDOATjeyAPTJMJPnBR83uE/refunds",
            "reversals_count": 0,
            "reversals_total_amount": 0,
            "reversals_total_fee": 0,
            "reversals_uri": "/v1/invoices/IVDOATjeyAPTJMJPnBR83uE/reversals",
            "sequence_number": 1,
            "settle_at": "2012-12-20T21:36:33.034328Z",
            "settlement": {
                "_type": "settlement",
                "_uris": {},
                "amount": 1785,
                "created_at": "2013-01-11T02:01:52.087715Z",
                "events_uri": "/v1/settlements/ST6KJstgXSFUJI4nJaZluQlG/events",
                "id": "ST6KJstgXSFUJI4nJaZluQlG",
                "invoice_uri": "/v1/invoices/IVDOATjeyAPTJMJPnBR83uE",
                "marketplace_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY",
                "state": "submitted",
                "updated_at": "2013-01-12T00:38:40.134514Z",
                "uri": "/v1/invoices/IVDOATjeyAPTJMJPnBR83uE/settlements/ST6KJstgXSFUJI4nJaZluQlG"
            },
            "settlements_uri": "/v1/invoices/IVDOATjeyAPTJMJPnBR83uE/settlements",
            "source": null,
            "state": "paid",
            "total_fee": 1785,
            "updated_at": "2013-01-11T02:01:51.739534Z",
            "uri": "/v1/invoices/IVDOATjeyAPTJMJPnBR83uE",
            "variable_fee_percentage": 3.5
        }
    ],
    "last_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/invoices?q=&sort=created_at%2Cdesc&limit=20&offset=0",
    "limit": 20,
    "next_uri": null,
    "offset": 0,
    "previous_uri": null,
    "total": 16,
    "uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/invoices?limit=20&offset=0&q=&sort=created_at%2Cdesc"
}

]);