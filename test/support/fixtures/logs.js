Balanced.Adapter.addFixtures([{
    "first_uri": "/v1/logs?marketplace=MP5m04ORxNlNDm1bB7nkcgSY&method%5B%5D=post&limit=10&offset=0",
    "_type": "page",
    "items": [
        {
            "_type": "log_search",
            "endpoint": "verifications",
            "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3GJuPQtalOstj1ZOqHn6eX/verifications/BZ3Id7dzTwISb8XlR3jpxbiU?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-22T23:00:25.563638Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM7eb02462f32211e28797026ba7d31e6f",
            "status_rollup": "4XX",
            "id": "OHM7eb02462f32211e28797026ba7d31e6f",
            "_uris": {},
            "message": {
                "date": "2013-07-22T23:00:25.563638Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3GJuPQtalOstj1ZOqHn6eX/verifications/BZ3Id7dzTwISb8XlR3jpxbiU?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                    "headers": {
                        "X-Real-Ip": "50.18.199.26",
                        "User-Agent": "balanced-python/0.11.10"
                    },
                    "method": "PUT",
                    "payload": {
                        "_type": "bank_account_authentication",
                        "_uris": {},
                        "state": "pending",
                        "amount_1": "12",
                        "attempts": 0,
                        "amount_2": "45",
                        "id": "BZ3Id7dzTwISb8XlR3jpxbiU",
                        "remaining_attempts": 3
                    }
                },
                "response": {
                    "status": "409 CONFLICT",
                    "body": {
                        "status": "Conflict",
                        "category_code": "bank-account-authentication-failed",
                        "description": "Authentication amounts do not match. Your request id is OHM7eb02462f32211e28797026ba7d31e6f.",
                        "_uris": {},
                        "status_code": 409,
                        "category_type": "logical",
                        "extras": {},
                        "request_id": "OHM7eb02462f32211e28797026ba7d31e6f",
                        "additional": null
                    }
                }
            },
            "method": "PUT",
            "guru_id": "OHM7eb02462f32211e28797026ba7d31e6f"
        },
        {
            "_type": "log_search",
            "endpoint": "verifications",
            "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3GJuPQtalOstj1ZOqHn6eX/verifications?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-22T23:00:17.695028Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM79745c5cf32211e2869c026ba7f8ec28",
            "status_rollup": "2XX",
            "id": "OHM79745c5cf32211e2869c026ba7f8ec28",
            "_uris": {},
            "message": {
                "date": "2013-07-22T23:00:17.695028Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3GJuPQtalOstj1ZOqHn6eX/verifications?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                    "headers": {
                        "X-Real-Ip": "50.18.204.103",
                        "User-Agent": "balanced-python/0.11.10"
                    },
                    "method": "POST",
                    "payload": {
                        "id": null
                    }
                },
                "response": {
                    "status": "201 CREATED",
                    "body": {
                        "_type": "bank_account_authentication",
                        "state": "pending",
                        "uri": "/v1/bank_accounts/BA3GJuPQtalOstj1ZOqHn6eX/verifications/BZ3Id7dzTwISb8XlR3jpxbiU",
                        "attempts": 0,
                        "_uris": {},
                        "id": "BZ3Id7dzTwISb8XlR3jpxbiU",
                        "remaining_attempts": 3
                    }
                }
            },
            "method": "POST",
            "guru_id": "OHM79745c5cf32211e2869c026ba7f8ec28"
        },
        {
            "_type": "log_search",
            "endpoint": "bank_accounts",
            "url": "http://api.balancedpayments.com/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-22T23:31:57.390295Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHMe60db1def32611e2bd63026ba7cac9da",
            "status_rollup": "2XX",
            "id": "OHMe60db1def32611e2bd63026ba7cac9da",
            "_uris": {},
            "message": {
                "date": "2013-07-22T23:31:57.390295Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                    "headers": {
                        "X-Real-Ip": "50.18.204.103",
                        "User-Agent": "balanced-python/0.11.10"
                    },
                    "method": "POST",
                    "payload": {
                        "routing_number": "322271627",
                        "account_number": "XXXXXXXXX",
                        "type": "checking",
                        "id": null,
                        "name": "Account #2"
                    }
                },
                "response": {
                    "status": "201 CREATED",
                    "body": {
                        "fingerprint": "15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225",
                        "_type": "bank_account",
                        "customer": null,
                        "meta": {},
                        "id": "BA70vu1w6c6XuEhyCXA8Gzwu",
                        "is_valid": true,
                        "credits_uri": "/v1/bank_accounts/BA70vu1w6c6XuEhyCXA8Gzwu/credits",
                        "type": "checking",
                        "bank_name": "J.P. MORGAN CHASE BANK, N.A.",
                        "can_hold": false,
                        "bank_code": "322271627",
                        "default_debit": false,
                        "_uris": {
                            "transactions_uri": {
                                "_type": "page",
                                "key": "transactions"
                            },
                            "verifications_uri": {
                                "_type": "page",
                                "key": "verifications"
                            },
                            "credits_uri": {
                                "_type": "page",
                                "key": "credits"
                            }
                        },
                        "last_four": "6789",
                        "default_credit": true,
                        "can_debit": false,
                        "verifications_uri": "/v1/bank_accounts/BA70vu1w6c6XuEhyCXA8Gzwu/verifications",
                        "routing_number": "322271627",
                        "verification_uri": null,
                        "transactions_uri": "/v1/bank_accounts/BA70vu1w6c6XuEhyCXA8Gzwu/transactions",
                        "name": "Account #2",
                        "can_credit": true,
                        "created_at": "2013-07-22T23:31:57.216996Z",
                        "uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts/BA70vu1w6c6XuEhyCXA8Gzwu",
                        "account_number": "xxxxx6789"
                    }
                }
            },
            "method": "POST",
            "guru_id": "OHMe60db1def32611e2bd63026ba7cac9da"
        },
        {
            "_type": "log_search",
            "endpoint": "verifications",
            "url": "http://api.balancedpayments.com/v1/bank_accounts/BA70vu1w6c6XuEhyCXA8Gzwu/verifications?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-22T23:31:58.419296Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHMe67bb09ef32611e2aadb026ba7f8ec28",
            "status_rollup": "2XX",
            "id": "OHMe67bb09ef32611e2aadb026ba7f8ec28",
            "_uris": {},
            "message": {
                "date": "2013-07-22T23:31:58.419296Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/bank_accounts/BA70vu1w6c6XuEhyCXA8Gzwu/verifications?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                    "headers": {
                        "X-Real-Ip": "50.18.199.26",
                        "User-Agent": "balanced-python/0.11.10"
                    },
                    "method": "POST",
                    "payload": {
                        "id": null
                    }
                },
                "response": {
                    "status": "201 CREATED",
                    "body": {
                        "_type": "bank_account_authentication",
                        "state": "pending",
                        "uri": "/v1/bank_accounts/BA70vu1w6c6XuEhyCXA8Gzwu/verifications/BZ71JSoVjywoY4FejLvyxVEs",
                        "attempts": 0,
                        "_uris": {},
                        "id": "BZ71JSoVjywoY4FejLvyxVEs",
                        "remaining_attempts": 3
                    }
                }
            },
            "method": "POST",
            "guru_id": "OHMe67bb09ef32611e2aadb026ba7f8ec28"
        },
        {
            "_type": "log_search",
            "endpoint": "verifications",
            "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications/BZ3BCZWTcdmldA7i2PP00axw?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-24T23:48:48.341797Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM95b3c426f4bb11e2a58a026ba7c1aba6",
            "status_rollup": "4XX",
            "id": "OHM95b3c426f4bb11e2a58a026ba7c1aba6",
            "_uris": {},
            "message": {
                "date": "2013-07-24T23:48:48.341797Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications/BZ3BCZWTcdmldA7i2PP00axw?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                    "headers": {
                        "X-Real-Ip": "50.18.199.26",
                        "User-Agent": "balanced-python/0.11.10"
                    },
                    "method": "PUT",
                    "payload": {
                        "errorStatusCode": 409,
                        "_type": "bank_account_authentication",
                        "_uris": {},
                        "state": "pending",
                        "amount_1": "1",
                        "attempts": 2,
                        "amount_2": "1",
                        "id": "BZ3BCZWTcdmldA7i2PP00axw",
                        "remaining_attempts": 1
                    }
                },
                "response": {
                    "status": "409 CONFLICT",
                    "body": {
                        "status": "Conflict",
                        "category_code": "bank-account-authentication-failed",
                        "description": "Authentication amounts do not match. Your request id is OHM95b3c426f4bb11e2a58a026ba7c1aba6.",
                        "_uris": {},
                        "status_code": 409,
                        "category_type": "logical",
                        "extras": {},
                        "request_id": "OHM95b3c426f4bb11e2a58a026ba7c1aba6",
                        "additional": null
                    }
                }
            },
            "method": "PUT",
            "guru_id": "OHM95b3c426f4bb11e2a58a026ba7c1aba6"
        },
        {
            "_type": "log_search",
            "endpoint": "verifications",
            "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-24T23:49:09.910861Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHMa22d5014f4bb11e29c7a026ba7cac9da",
            "status_rollup": "2XX",
            "id": "OHMa22d5014f4bb11e29c7a026ba7cac9da",
            "_uris": {},
            "message": {
                "date": "2013-07-24T23:49:09.910861Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                    "headers": {
                        "X-Real-Ip": "50.18.204.103",
                        "User-Agent": "balanced-python/0.11.10"
                    },
                    "method": "POST",
                    "payload": {
                        "id": null
                    }
                },
                "response": {
                    "status": "201 CREATED",
                    "body": {
                        "_type": "bank_account_authentication",
                        "state": "pending",
                        "uri": "/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications/BZ4WJZUrCUN56WMylceCgAb0",
                        "attempts": 0,
                        "_uris": {},
                        "id": "BZ4WJZUrCUN56WMylceCgAb0",
                        "remaining_attempts": 3
                    }
                }
            },
            "method": "POST",
            "guru_id": "OHMa22d5014f4bb11e29c7a026ba7cac9da"
        },
        {
            "_type": "log_search",
            "endpoint": "verifications",
            "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-25T00:21:12.409070Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM1adb8284f4c011e299da026ba7cd33d0",
            "status_rollup": "2XX",
            "id": "OHM1adb8284f4c011e299da026ba7cd33d0",
            "_uris": {},
            "message": {
                "date": "2013-07-25T00:21:12.409070Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                    "headers": {
                        "X-Real-Ip": "50.18.199.26",
                        "User-Agent": "balanced-python/0.11.10"
                    },
                    "method": "POST",
                    "payload": {
                        "id": null
                    }
                },
                "response": {
                    "status": "201 CREATED",
                    "body": {
                        "_type": "bank_account_authentication",
                        "state": "pending",
                        "uri": "/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications/BZRD7wo2n780mcFKmI6cIBG",
                        "attempts": 0,
                        "_uris": {},
                        "id": "BZRD7wo2n780mcFKmI6cIBG",
                        "remaining_attempts": 3
                    }
                }
            },
            "method": "POST",
            "guru_id": "OHM1adb8284f4c011e299da026ba7cd33d0"
        },
        {
            "_type": "log_search",
            "endpoint": "verifications",
            "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications/BZRD7wo2n780mcFKmI6cIBG?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-25T22:19:45.211909Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM4f56bd22f57811e2aa92026ba7cac9da",
            "status_rollup": "4XX",
            "id": "OHM4f56bd22f57811e2aa92026ba7cac9da",
            "_uris": {},
            "message": {
                "date": "2013-07-25T22:19:45.211909Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications/BZRD7wo2n780mcFKmI6cIBG?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                    "headers": {
                        "X-Real-Ip": "50.18.199.26",
                        "User-Agent": "balanced-python/0.11.10"
                    },
                    "method": "PUT",
                    "payload": {
                        "_type": "bank_account_authentication",
                        "created_at": "2013-07-25T00:21:12.230000+00:00Z",
                        "amount_2": "1",
                        "updated_at": "2013-07-25T00:21:12.230000+00:00Z",
                        "amount_1": "1",
                        "state": "pending",
                        "_uris": {},
                        "attempts": 0,
                        "id": "BZRD7wo2n780mcFKmI6cIBG",
                        "remaining_attempts": 3
                    }
                },
                "response": {
                    "status": "409 CONFLICT",
                    "body": {
                        "status": "Conflict",
                        "category_code": "bank-account-authentication-failed",
                        "description": "Authentication amounts do not match. Your request id is OHM4f56bd22f57811e2aa92026ba7cac9da.",
                        "_uris": {},
                        "status_code": 409,
                        "category_type": "logical",
                        "extras": {},
                        "request_id": "OHM4f56bd22f57811e2aa92026ba7cac9da",
                        "additional": null
                    }
                }
            },
            "method": "PUT",
            "guru_id": "OHM4f56bd22f57811e2aa92026ba7cac9da"
        },
        {
            "_type": "log_search",
            "endpoint": "marketplaces",
            "url": "http://api.balancedpayments.com/v1/marketplaces",
            "created_at": "2013-07-05T20:10:59.062362Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM02074b5ae5af11e2a151026ba7f8ec28",
            "status_rollup": "2XX",
            "id": "OHM02074b5ae5af11e2a151026ba7f8ec28",
            "_uris": {},
            "message": {
                "date": "2013-07-05T20:10:59.062362Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/marketplaces",
                    "headers": {
                        "X-Real-Ip": "50.18.199.26",
                        "User-Agent": "balanced-python/0.11.10"
                    },
                    "method": "POST",
                    "payload": {
                        "support_phone_number": "805-705-2440",
                        "domain_url": "https://www.nodesocket.com",
                        "support_email_address": "justin@balancedpayments.com",
                        "name": "NodeSocket",
                        "id": null
                    }
                },
                "response": {
                    "status": "201 CREATED",
                    "body": {
                        "fee_account": {
                            "customer_uri": "/v1/customers/AC3v8JoneTUe7AUrjv2mj8s",
                            "_type": "account",
                            "transactions_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC3v8JoneTUe7AUrjv2mj8s/transactions",
                            "name": null,
                            "roles": [
                                "merchant",
                                "buyer"
                            ],
                            "created_at": "2013-07-05T20:10:58.782496Z",
                            "uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC3v8JoneTUe7AUrjv2mj8s",
                            "bank_accounts_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC3v8JoneTUe7AUrjv2mj8s/bank_accounts",
                            "refunds_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC3v8JoneTUe7AUrjv2mj8s/refunds",
                            "merchant_uri": "/v1/merchants/MR6xBgEkDmXbJjfgGDVpCeGb",
                            "_uris": {
                                "customer_uri": {
                                    "_type": "customer",
                                    "key": "customer"
                                },
                                "holds_uri": {
                                    "_type": "page",
                                    "key": "holds"
                                },
                                "bank_accounts_uri": {
                                    "_type": "page",
                                    "key": "bank_accounts"
                                },
                                "refunds_uri": {
                                    "_type": "page",
                                    "key": "refunds"
                                },
                                "merchant_uri": {
                                    "_type": "merchant",
                                    "key": "merchant"
                                },
                                "debits_uri": {
                                    "_type": "page",
                                    "key": "debits"
                                },
                                "transactions_uri": {
                                    "_type": "page",
                                    "key": "transactions"
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
                            "debits_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC3v8JoneTUe7AUrjv2mj8s/debits",
                            "holds_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC3v8JoneTUe7AUrjv2mj8s/holds",
                            "email_address": "fee@poundpay.com",
                            "id": "AC3v8JoneTUe7AUrjv2mj8s",
                            "credits_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC3v8JoneTUe7AUrjv2mj8s/credits",
                            "cards_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC3v8JoneTUe7AUrjv2mj8s/cards"
                        },
                        "support_email_address": "justin@balancedpayments.com",
                        "callbacks_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/callbacks",
                        "accounts_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts",
                        "owner_account": {
                            "customer_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm",
                            "_type": "account",
                            "transactions_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC3ufGxx2hKgI0pzjzgbxtm/transactions",
                            "name": "NodeSocket LLC",
                            "roles": [
                                "merchant"
                            ],
                            "created_at": "2013-07-05T20:10:58.769763Z",
                            "uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC3ufGxx2hKgI0pzjzgbxtm",
                            "bank_accounts_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts",
                            "refunds_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC3ufGxx2hKgI0pzjzgbxtm/refunds",
                            "merchant_uri": "/v1/merchants/MR6xBgEkDmXbJjfgGDVpCeGb",
                            "_uris": {
                                "customer_uri": {
                                    "_type": "customer",
                                    "key": "customer"
                                },
                                "holds_uri": {
                                    "_type": "page",
                                    "key": "holds"
                                },
                                "bank_accounts_uri": {
                                    "_type": "page",
                                    "key": "bank_accounts"
                                },
                                "refunds_uri": {
                                    "_type": "page",
                                    "key": "refunds"
                                },
                                "merchant_uri": {
                                    "_type": "merchant",
                                    "key": "merchant"
                                },
                                "debits_uri": {
                                    "_type": "page",
                                    "key": "debits"
                                },
                                "transactions_uri": {
                                    "_type": "page",
                                    "key": "transactions"
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
                            "debits_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC3ufGxx2hKgI0pzjzgbxtm/debits",
                            "holds_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC3ufGxx2hKgI0pzjzgbxtm/holds",
                            "email_address": null,
                            "id": "AC3ufGxx2hKgI0pzjzgbxtm",
                            "credits_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC3ufGxx2hKgI0pzjzgbxtm/credits",
                            "cards_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC3ufGxx2hKgI0pzjzgbxtm/cards"
                        },
                        "can_cancel_transactions": false,
                        "meta": {},
                        "id": "MP5m04ORxNlNDm1bB7nkcgSY",
                        "domain_url": "https://www.nodesocket.com",
                        "can_debit_bank_accounts": false,
                        "production": true,
                        "credits_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/credits",
                        "escrow_account": {
                            "customer_uri": "/v1/customers/AC3v3yNHp87MCWLqjpozRKE",
                            "_type": "account",
                            "transactions_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC3v3yNHp87MCWLqjpozRKE/transactions",
                            "name": null,
                            "roles": [],
                            "created_at": "2013-07-05T20:10:58.781322Z",
                            "uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC3v3yNHp87MCWLqjpozRKE",
                            "bank_accounts_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC3v3yNHp87MCWLqjpozRKE/bank_accounts",
                            "refunds_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC3v3yNHp87MCWLqjpozRKE/refunds",
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
                            "debits_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC3v3yNHp87MCWLqjpozRKE/debits",
                            "holds_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC3v3yNHp87MCWLqjpozRKE/holds",
                            "email_address": "escrow@poundpay.com",
                            "id": "AC3v3yNHp87MCWLqjpozRKE",
                            "credits_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC3v3yNHp87MCWLqjpozRKE/credits",
                            "cards_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC3v3yNHp87MCWLqjpozRKE/cards"
                        },
                        "_type": "marketplace",
                        "events_uri": "/v1/events",
                        "bank_accounts_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/bank_accounts",
                        "_uris": {
                            "callbacks_uri": {
                                "_type": "page",
                                "key": "callbacks"
                            },
                            "transactions_uri": {
                                "_type": "page",
                                "key": "transactions"
                            },
                            "events_uri": {
                                "_type": "page",
                                "key": "events"
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
                            "holds_uri": {
                                "_type": "page",
                                "key": "holds"
                            },
                            "customers_uri": {
                                "_type": "page",
                                "key": "customers"
                            },
                            "accounts_uri": {
                                "_type": "page",
                                "key": "accounts"
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
                        "transactions_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/transactions",
                        "owner_customer": {
                            "twitter": null,
                            "meta": {},
                            "id": "AC3ufGxx2hKgI0pzjzgbxtm",
                            "email": null,
                            "_type": "customer",
                            "source_uri": null,
                            "bank_accounts_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts",
                            "phone": "+8057052440",
                            "merchant_uri": "/v1/merchants/MR6xBgEkDmXbJjfgGDVpCeGb",
                            "facebook": null,
                            "address": {
                                "city": "San Francisco",
                                "region": "CA",
                                "postal_code": "94108",
                                "country_code": "USA",
                                "street_address": "626 Bush St. Apt 304"
                            },
                            "destination_uri": null,
                            "business_name": "NodeSocket LLC",
                            "credits_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/credits",
                            "cards_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/cards",
                            "holds_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/holds",
                            "name": "Justin Keller",
                            "dob": null,
                            "created_at": "2013-07-05T20:10:58.769763Z",
                            "is_identity_verified": true,
                            "uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm",
                            "refunds_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/refunds",
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
                                "merchant_uri": {
                                    "_type": "merchant",
                                    "key": "merchant"
                                },
                                "debits_uri": {
                                    "_type": "page",
                                    "key": "debits"
                                },
                                "holds_uri": {
                                    "_type": "page",
                                    "key": "holds"
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
                            "debits_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/debits",
                            "transactions_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/transactions",
                            "ssn_last4": null,
                            "ein": "123456789"
                        },
                        "cards_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/cards",
                        "in_escrow": 0,
                        "holds_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/holds",
                        "name": "NodeSocket",
                        "can_reverse_transactions": true,
                        "uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY",
                        "support_phone_number": "+8057052440",
                        "refunds_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/refunds",
                        "debits_uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/debits",
                        "customers_uri": "/v1/customers"
                    }
                }
            },
            "method": "POST",
            "guru_id": "OHM02074b5ae5af11e2a151026ba7f8ec28"
        },
        {
            "_type": "log_search",
            "endpoint": "bank_accounts",
            "url": "http://api.balancedpayments.com/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-22T23:00:16.443542Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM78e3f40af32211e2ba67026ba7d31e6f",
            "status_rollup": "2XX",
            "id": "OHM78e3f40af32211e2ba67026ba7d31e6f",
            "_uris": {},
            "message": {
                "date": "2013-07-22T23:00:16.443542Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                    "headers": {
                        "X-Real-Ip": "50.18.199.26",
                        "User-Agent": "balanced-python/0.11.10"
                    },
                    "method": "POST",
                    "payload": {
                        "routing_number": "322271627",
                        "account_number": "XXXXXXXXX",
                        "type": "checking",
                        "id": null,
                        "name": "Justin Keller"
                    }
                },
                "response": {
                    "status": "201 CREATED",
                    "body": {
                        "fingerprint": "15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225",
                        "_type": "bank_account",
                        "customer": null,
                        "meta": {},
                        "id": "BA3GJuPQtalOstj1ZOqHn6eX",
                        "is_valid": true,
                        "credits_uri": "/v1/bank_accounts/BA3GJuPQtalOstj1ZOqHn6eX/credits",
                        "type": "checking",
                        "bank_name": "J.P. MORGAN CHASE BANK, N.A.",
                        "can_hold": false,
                        "bank_code": "322271627",
                        "default_debit": false,
                        "_uris": {
                            "transactions_uri": {
                                "_type": "page",
                                "key": "transactions"
                            },
                            "verifications_uri": {
                                "_type": "page",
                                "key": "verifications"
                            },
                            "credits_uri": {
                                "_type": "page",
                                "key": "credits"
                            }
                        },
                        "last_four": "6789",
                        "default_credit": true,
                        "can_debit": false,
                        "verifications_uri": "/v1/bank_accounts/BA3GJuPQtalOstj1ZOqHn6eX/verifications",
                        "routing_number": "322271627",
                        "verification_uri": null,
                        "transactions_uri": "/v1/bank_accounts/BA3GJuPQtalOstj1ZOqHn6eX/transactions",
                        "name": "Justin Keller",
                        "can_credit": true,
                        "created_at": "2013-07-22T23:00:16.267465Z",
                        "uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts/BA3GJuPQtalOstj1ZOqHn6eX",
                        "account_number": "xxxxx6789"
                    }
                }
            },
            "method": "POST",
            "guru_id": "OHM78e3f40af32211e2ba67026ba7d31e6f"
        }
    ],
    "previous_uri": null,
    "uri": "/v1/logs?method%5B%5D=post&method%5B%5D=put&method%5B%5D=delete",
    "_uris": {
        "first_uri": {
            "_type": "page",
            "key": "first"
        },
        "previous_uri": {
            "_type": "page",
            "key": "previous"
        },
        "next_uri": {
            "_type": "page",
            "key": "next"
        },
        "last_uri": {
            "_type": "page",
            "key": "last"
        }
    },
    "limit": 10,
    "offset": 0,
    "counts": null,
    "total": 33,
    "next_uri": "/v1/logs?marketplace=MP5m04ORxNlNDm1bB7nkcgSY&method%5B%5D=post&limit=10&offset=10",
    "id": null,
    "last_uri": "/v1/logs?marketplace=MP5m04ORxNlNDm1bB7nkcgSY&method%5B%5D=post&limit=10&offset=30"
}]);