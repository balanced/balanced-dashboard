Balanced.Adapter.addFixtures([{
    "first_uri": "/v1/logs?sort=created_at%2Cdesc&marketplace=MP5m04ORxNlNDm1bB7nkcgSY&q=&limit=10&method%5Bin%5D=post%2Cput%2Cdelete&offset=0",
    "_type": "page",
    "items": [
        {
            "_type": "log_search",
            "endpoint": "verifications",
            "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-30T17:58:28.115936Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHMa2a01fecf94111e2ab70026ba7cac9da",
            "status_rollup": "2XX",
            "id": "OHMa2a01fecf94111e2ab70026ba7cac9da",
            "_uris": {},
            "message": {
                "date": "2013-07-30T17:58:28.115936Z",
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
                        "created_at": "2013-07-30T17:58:28.020762Z",
                        "uri": "/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications/BZ4XSX2qdUC6Lv6K6NRE0Jt0",
                        "updated_at": "2013-07-30T17:58:28.020767Z",
                        "state": "pending",
                        "_uris": {},
                        "attempts": 0,
                        "id": "BZ4XSX2qdUC6Lv6K6NRE0Jt0",
                        "remaining_attempts": 3
                    }
                }
            },
            "method": "POST",
            "guru_id": "OHMa2a01fecf94111e2ab70026ba7cac9da"
        },
        {
            "_type": "log_search",
            "endpoint": "verifications",
            "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications/BZRD7wo2n780mcFKmI6cIBG?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-30T17:58:17.969176Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM9d1fc57cf94111e291bb026ba7d31e6f",
            "status_rollup": "4XX",
            "id": "OHM9d1fc57cf94111e291bb026ba7d31e6f",
            "_uris": {},
            "message": {
                "date": "2013-07-30T17:58:17.969176Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications/BZRD7wo2n780mcFKmI6cIBG?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                    "headers": {
                        "X-Real-Ip": "50.18.199.26",
                        "User-Agent": "balanced-python/0.11.10"
                    },
                    "method": "PUT",
                    "payload": {
                        "errorStatusCode": 409,
                        "_type": "bank_account_authentication",
                        "created_at": "2013-07-25T00:21:12.230000+00:00Z",
                        "amount_2": "23",
                        "updated_at": "2013-07-30T17:58:14.766000+00:00Z",
                        "amount_1": "2",
                        "state": "deposit_succeeded",
                        "_uris": {},
                        "attempts": 2,
                        "id": "BZRD7wo2n780mcFKmI6cIBG",
                        "remaining_attempts": 1
                    }
                },
                "response": {
                    "status": "409 CONFLICT",
                    "body": {
                        "status": "Conflict",
                        "category_code": "bank-account-authentication-failed",
                        "description": "Authentication amounts do not match. Your request id is OHM9d1fc57cf94111e291bb026ba7d31e6f.",
                        "_uris": {},
                        "status_code": 409,
                        "category_type": "logical",
                        "extras": {},
                        "request_id": "OHM9d1fc57cf94111e291bb026ba7d31e6f",
                        "additional": null
                    }
                }
            },
            "method": "PUT",
            "guru_id": "OHM9d1fc57cf94111e291bb026ba7d31e6f"
        },
        {
            "_type": "log_search",
            "endpoint": "verifications",
            "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications/BZRD7wo2n780mcFKmI6cIBG?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-30T17:58:14.919449Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM9b440b5af94111e28918026ba7c1aba6",
            "status_rollup": "4XX",
            "id": "OHM9b440b5af94111e28918026ba7c1aba6",
            "_uris": {},
            "message": {
                "date": "2013-07-30T17:58:14.919449Z",
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
                        "amount_2": "23",
                        "updated_at": "2013-07-26T04:12:06.790000+00:00Z",
                        "amount_1": "2",
                        "state": "deposit_succeeded",
                        "_uris": {},
                        "attempts": 1,
                        "id": "BZRD7wo2n780mcFKmI6cIBG",
                        "remaining_attempts": 2
                    }
                },
                "response": {
                    "status": "409 CONFLICT",
                    "body": {
                        "status": "Conflict",
                        "category_code": "bank-account-authentication-failed",
                        "description": "Authentication amounts do not match. Your request id is OHM9b440b5af94111e28918026ba7c1aba6.",
                        "_uris": {},
                        "status_code": 409,
                        "category_type": "logical",
                        "extras": {},
                        "request_id": "OHM9b440b5af94111e28918026ba7c1aba6",
                        "additional": null
                    }
                }
            },
            "method": "PUT",
            "guru_id": "OHM9b440b5af94111e28918026ba7c1aba6"
        },
        {
            "_type": "log_search",
            "endpoint": "customers",
            "url": "http://api.balancedpayments.com/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-30T01:05:29.878665Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM2091d366f8b411e28918026ba7c1aba6",
            "status_rollup": "2XX",
            "id": "OHM2091d366f8b411e28918026ba7c1aba6",
            "_uris": {},
            "message": {
                "date": "2013-07-30T01:05:29.878665Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                    "headers": {
                        "X-Real-Ip": "50.18.204.103",
                        "User-Agent": "balanced-python/0.11.10"
                    },
                    "method": "PUT",
                    "payload": {
                        "twitter": null,
                        "validationErrors": {
                            "email": "\"dsfsa\" must be a valid email address as specified by RFC-2822"
                        },
                        "meta": {},
                        "id": "AC3ufGxx2hKgI0pzjzgbxtm",
                        "email": null,
                        "_type": "customer",
                        "source_uri": null,
                        "bank_accounts_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts",
                        "phone": "+8057052440",
                        "_uris": {
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
                        "facebook": null,
                        "address": {
                            "city": "San Francisco",
                            "region": "CA",
                            "postal_code": "94108",
                            "street_address": "626 Bush St. Apt 304",
                            "country_code": "USA"
                        },
                        "destination_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts/BA1ifrc8QtTfqbRqk1tFAa0T",
                        "business_name": "NodeSocket LLC",
                        "reversals_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/reversals",
                        "credits_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/credits",
                        "cards_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/cards",
                        "holds_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/holds",
                        "name": "Justin Keller",
                        "dob": "1982-06",
                        "created_at": "2013-07-05T20:10:58.769000+00:00Z",
                        "is_identity_verified": false,
                        "refunds_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/refunds",
                        "merchant_uri": "v1/merchants/MR6xBgEkDmXbJjfgGDVpCeGb",
                        "debits_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/debits",
                        "transactions_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/transactions",
                        "ssn_last4": null,
                        "ein": "123456789"
                    }
                },
                "response": {
                    "status": "200 OK",
                    "body": {
                        "twitter": null,
                        "meta": {},
                        "id": "AC3ufGxx2hKgI0pzjzgbxtm",
                        "email": null,
                        "_type": "customer",
                        "source_uri": null,
                        "bank_accounts_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts",
                        "phone": "+8057052440",
                        "_uris": {
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
                        "facebook": null,
                        "address": {
                            "city": "San Francisco",
                            "region": "CA",
                            "postal_code": "94108",
                            "country_code": "USA",
                            "street_address": "626 Bush St. Apt 304"
                        },
                        "destination_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts/BA1ifrc8QtTfqbRqk1tFAa0T",
                        "business_name": "NodeSocket LLC",
                        "reversals_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/reversals",
                        "credits_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/credits",
                        "cards_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/cards",
                        "holds_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/holds",
                        "name": "Justin Keller",
                        "dob": "1982-06",
                        "created_at": "2013-07-05T20:10:58.769763Z",
                        "is_identity_verified": false,
                        "uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm",
                        "refunds_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/refunds",
                        "merchant_uri": "/v1/merchants/MR6xBgEkDmXbJjfgGDVpCeGb",
                        "debits_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/debits",
                        "transactions_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/transactions",
                        "ssn_last4": null,
                        "ein": "123456789"
                    }
                }
            },
            "method": "PUT",
            "guru_id": "OHM2091d366f8b411e28918026ba7c1aba6"
        },
        {
            "_type": "log_search",
            "endpoint": "customers",
            "url": "http://api.balancedpayments.com/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-30T01:05:13.387854Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM16b5a9f8f8b411e29e3d026ba7f8ec28",
            "status_rollup": "4XX",
            "id": "OHM16b5a9f8f8b411e29e3d026ba7f8ec28",
            "_uris": {},
            "message": {
                "date": "2013-07-30T01:05:13.387854Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                    "headers": {
                        "X-Real-Ip": "50.18.199.26",
                        "User-Agent": "balanced-python/0.11.10"
                    },
                    "method": "PUT",
                    "payload": {
                        "twitter": null,
                        "meta": {},
                        "id": "AC3ufGxx2hKgI0pzjzgbxtm",
                        "email": "dsfsa",
                        "_type": "customer",
                        "source_uri": null,
                        "bank_accounts_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts",
                        "phone": "+8057052440",
                        "_uris": {
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
                        "facebook": null,
                        "address": {
                            "city": "San Francisco",
                            "region": "CA",
                            "postal_code": "94108",
                            "street_address": "626 Bush St. Apt 304",
                            "country_code": "USA"
                        },
                        "destination_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts/BA1ifrc8QtTfqbRqk1tFAa0T",
                        "business_name": "NodeSocket LLC",
                        "reversals_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/reversals",
                        "credits_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/credits",
                        "cards_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/cards",
                        "holds_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/holds",
                        "name": "Justin Keller",
                        "dob": "1982-06",
                        "created_at": "2013-07-05T20:10:58.769000+00:00Z",
                        "is_identity_verified": false,
                        "refunds_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/refunds",
                        "merchant_uri": "v1/merchants/MR6xBgEkDmXbJjfgGDVpCeGb",
                        "debits_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/debits",
                        "transactions_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/transactions",
                        "ssn_last4": null,
                        "ein": "123456789"
                    }
                },
                "response": {
                    "status": "400 BAD REQUEST",
                    "body": {
                        "status": "Bad Request",
                        "category_code": "request",
                        "description": "Invalid field [email] - \"dsfsa\" must be a valid email address as specified by RFC-2822 Your request id is OHM16b5a9f8f8b411e29e3d026ba7f8ec28.",
                        "_uris": {},
                        "status_code": 400,
                        "category_type": "request",
                        "extras": {
                            "email": "\"dsfsa\" must be a valid email address as specified by RFC-2822"
                        },
                        "request_id": "OHM16b5a9f8f8b411e29e3d026ba7f8ec28",
                        "additional": null
                    }
                }
            },
            "method": "PUT",
            "guru_id": "OHM16b5a9f8f8b411e29e3d026ba7f8ec28"
        },
        {
            "_type": "log_search",
            "endpoint": "customers",
            "url": "http://api.balancedpayments.com/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-30T01:05:00.145819Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM0ed8f064f8b411e28122026ba7d31e6f",
            "status_rollup": "2XX",
            "id": "OHM0ed8f064f8b411e28122026ba7d31e6f",
            "_uris": {},
            "message": {
                "date": "2013-07-30T01:05:00.145819Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                    "headers": {
                        "X-Real-Ip": "50.18.199.26",
                        "User-Agent": "balanced-python/0.11.10"
                    },
                    "method": "PUT",
                    "payload": {
                        "twitter": null,
                        "meta": {},
                        "id": "AC3ufGxx2hKgI0pzjzgbxtm",
                        "email": null,
                        "_type": "customer",
                        "source_uri": null,
                        "bank_accounts_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts",
                        "phone": "+8057052440",
                        "_uris": {
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
                        "facebook": null,
                        "address": {
                            "city": "San Francisco",
                            "region": "CA",
                            "postal_code": "94108",
                            "street_address": "626 Bush St. Apt 304",
                            "country_code": "USA"
                        },
                        "destination_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts/BA1ifrc8QtTfqbRqk1tFAa0T",
                        "business_name": "NodeSocket LLC",
                        "reversals_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/reversals",
                        "credits_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/credits",
                        "cards_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/cards",
                        "holds_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/holds",
                        "name": "Justin Keller",
                        "dob": "1982-06",
                        "created_at": "2013-07-05T20:10:58.769000+00:00Z",
                        "is_identity_verified": false,
                        "refunds_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/refunds",
                        "merchant_uri": "v1/merchants/MR6xBgEkDmXbJjfgGDVpCeGb",
                        "debits_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/debits",
                        "transactions_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/transactions",
                        "ssn_last4": null,
                        "ein": "123456789"
                    }
                },
                "response": {
                    "status": "200 OK",
                    "body": {
                        "twitter": null,
                        "meta": {},
                        "id": "AC3ufGxx2hKgI0pzjzgbxtm",
                        "email": null,
                        "_type": "customer",
                        "source_uri": null,
                        "bank_accounts_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts",
                        "phone": "+8057052440",
                        "_uris": {
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
                        "facebook": null,
                        "address": {
                            "city": "San Francisco",
                            "region": "CA",
                            "postal_code": "94108",
                            "country_code": "USA",
                            "street_address": "626 Bush St. Apt 304"
                        },
                        "destination_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts/BA1ifrc8QtTfqbRqk1tFAa0T",
                        "business_name": "NodeSocket LLC",
                        "reversals_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/reversals",
                        "credits_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/credits",
                        "cards_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/cards",
                        "holds_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/holds",
                        "name": "Justin Keller",
                        "dob": "1982-06",
                        "created_at": "2013-07-05T20:10:58.769763Z",
                        "is_identity_verified": false,
                        "uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm",
                        "refunds_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/refunds",
                        "merchant_uri": "/v1/merchants/MR6xBgEkDmXbJjfgGDVpCeGb",
                        "debits_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/debits",
                        "transactions_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/transactions",
                        "ssn_last4": null,
                        "ein": "123456789"
                    }
                }
            },
            "method": "PUT",
            "guru_id": "OHM0ed8f064f8b411e28122026ba7d31e6f"
        },
        {
            "_type": "log_search",
            "endpoint": "customers",
            "url": "http://api.balancedpayments.com/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-30T01:04:38.187642Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM01c25ceef8b411e2a89d026ba7c1aba6",
            "status_rollup": "2XX",
            "id": "OHM01c25ceef8b411e2a89d026ba7c1aba6",
            "_uris": {},
            "message": {
                "date": "2013-07-30T01:04:38.187642Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                    "headers": {
                        "X-Real-Ip": "50.18.204.103",
                        "User-Agent": "balanced-python/0.11.10"
                    },
                    "method": "PUT",
                    "payload": {
                        "twitter": null,
                        "meta": {},
                        "id": "AC3ufGxx2hKgI0pzjzgbxtm",
                        "email": null,
                        "_type": "customer",
                        "source_uri": null,
                        "bank_accounts_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts",
                        "phone": "+8057052440",
                        "_uris": {
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
                        "facebook": null,
                        "address": {
                            "city": "San Francisco",
                            "region": "CA",
                            "postal_code": "94108",
                            "street_address": "626 Bush St. Apt 304",
                            "country_code": "USA"
                        },
                        "destination_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts/BA1ifrc8QtTfqbRqk1tFAa0T",
                        "business_name": "NodeSocket LLC",
                        "reversals_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/reversals",
                        "credits_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/credits",
                        "cards_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/cards",
                        "holds_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/holds",
                        "name": "Justin Keller",
                        "dob": "1982-06",
                        "created_at": "2013-07-05T20:10:58.769000+00:00Z",
                        "is_identity_verified": false,
                        "refunds_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/refunds",
                        "merchant_uri": "v1/merchants/MR6xBgEkDmXbJjfgGDVpCeGb",
                        "debits_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/debits",
                        "transactions_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/transactions",
                        "ssn_last4": null,
                        "ein": "123456789"
                    }
                },
                "response": {
                    "status": "200 OK",
                    "body": {
                        "twitter": null,
                        "meta": {},
                        "id": "AC3ufGxx2hKgI0pzjzgbxtm",
                        "email": null,
                        "_type": "customer",
                        "source_uri": null,
                        "bank_accounts_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts",
                        "phone": "+8057052440",
                        "_uris": {
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
                        "facebook": null,
                        "address": {
                            "city": "San Francisco",
                            "region": "CA",
                            "postal_code": "94108",
                            "country_code": "USA",
                            "street_address": "626 Bush St. Apt 304"
                        },
                        "destination_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts/BA1ifrc8QtTfqbRqk1tFAa0T",
                        "business_name": "NodeSocket LLC",
                        "reversals_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/reversals",
                        "credits_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/credits",
                        "cards_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/cards",
                        "holds_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/holds",
                        "name": "Justin Keller",
                        "dob": "1982-06",
                        "created_at": "2013-07-05T20:10:58.769763Z",
                        "is_identity_verified": false,
                        "uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm",
                        "refunds_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/refunds",
                        "merchant_uri": "/v1/merchants/MR6xBgEkDmXbJjfgGDVpCeGb",
                        "debits_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/debits",
                        "transactions_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/transactions",
                        "ssn_last4": null,
                        "ein": "123456789"
                    }
                }
            },
            "method": "PUT",
            "guru_id": "OHM01c25ceef8b411e2a89d026ba7c1aba6"
        },
        {
            "_type": "log_search",
            "endpoint": "customers",
            "url": "http://api.balancedpayments.com/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-30T01:03:29.439013Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHMd503ca08f8b311e29ecb026ba7f8ec28",
            "status_rollup": "2XX",
            "id": "OHMd503ca08f8b311e29ecb026ba7f8ec28",
            "_uris": {},
            "message": {
                "date": "2013-07-30T01:03:29.439013Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                    "headers": {
                        "X-Real-Ip": "50.18.199.26",
                        "User-Agent": "balanced-python/0.11.10"
                    },
                    "method": "PUT",
                    "payload": {
                        "twitter": null,
                        "meta": {},
                        "id": "AC3ufGxx2hKgI0pzjzgbxtm",
                        "email": null,
                        "_type": "customer",
                        "source_uri": null,
                        "bank_accounts_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts",
                        "phone": "+8057052440",
                        "_uris": {
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
                        "facebook": null,
                        "address": {
                            "city": "San Francisco",
                            "region": "CA",
                            "postal_code": "94108",
                            "street_address": "626 Bush St. Apt 304",
                            "country_code": "USA"
                        },
                        "destination_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts/BA1ifrc8QtTfqbRqk1tFAa0T",
                        "business_name": "NodeSocket LLC",
                        "reversals_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/reversals",
                        "credits_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/credits",
                        "cards_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/cards",
                        "holds_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/holds",
                        "name": "Justin Keller",
                        "dob": "1982-06",
                        "created_at": "2013-07-05T20:10:58.769000+00:00Z",
                        "is_identity_verified": true,
                        "refunds_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/refunds",
                        "merchant_uri": "v1/merchants/MR6xBgEkDmXbJjfgGDVpCeGb",
                        "debits_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/debits",
                        "transactions_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/transactions",
                        "ssn_last4": "xxxx",
                        "ein": "123456789"
                    }
                },
                "response": {
                    "status": "200 OK",
                    "body": {
                        "twitter": null,
                        "meta": {},
                        "id": "AC3ufGxx2hKgI0pzjzgbxtm",
                        "email": null,
                        "_type": "customer",
                        "source_uri": null,
                        "bank_accounts_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts",
                        "phone": "+8057052440",
                        "_uris": {
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
                        "facebook": null,
                        "address": {
                            "city": "San Francisco",
                            "region": "CA",
                            "postal_code": "94108",
                            "country_code": "USA",
                            "street_address": "626 Bush St. Apt 304"
                        },
                        "destination_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts/BA1ifrc8QtTfqbRqk1tFAa0T",
                        "business_name": "NodeSocket LLC",
                        "reversals_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/reversals",
                        "credits_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/credits",
                        "cards_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/cards",
                        "holds_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/holds",
                        "name": "Justin Keller",
                        "dob": "1982-06",
                        "created_at": "2013-07-05T20:10:58.769763Z",
                        "is_identity_verified": false,
                        "uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm",
                        "refunds_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/refunds",
                        "merchant_uri": "/v1/merchants/MR6xBgEkDmXbJjfgGDVpCeGb",
                        "debits_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/debits",
                        "transactions_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/transactions",
                        "ssn_last4": null,
                        "ein": "123456789"
                    }
                }
            },
            "method": "PUT",
            "guru_id": "OHMd503ca08f8b311e29ecb026ba7f8ec28"
        },
        {
            "_type": "log_search",
            "endpoint": "customers",
            "url": "http://api.balancedpayments.com/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-30T01:02:52.994095Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHMc30bd246f8b311e29ecb026ba7f8ec28",
            "status_rollup": "4XX",
            "id": "OHMc30bd246f8b311e29ecb026ba7f8ec28",
            "_uris": {},
            "message": {
                "date": "2013-07-30T01:02:52.994095Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                    "headers": {
                        "X-Real-Ip": "50.18.199.26",
                        "User-Agent": "balanced-python/0.11.10"
                    },
                    "method": "PUT",
                    "payload": {
                        "twitter": null,
                        "meta": {},
                        "id": "AC3ufGxx2hKgI0pzjzgbxtm",
                        "email": "",
                        "_type": "customer",
                        "source_uri": null,
                        "bank_accounts_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts",
                        "phone": "+8057052440",
                        "_uris": {
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
                        "facebook": null,
                        "address": {
                            "city": "San Francisco",
                            "region": "CA",
                            "postal_code": "94108",
                            "street_address": "626 Bush St. Apt 304",
                            "country_code": "USA"
                        },
                        "destination_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts/BA1ifrc8QtTfqbRqk1tFAa0T",
                        "business_name": "NodeSocket LLC",
                        "reversals_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/reversals",
                        "credits_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/credits",
                        "cards_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/cards",
                        "holds_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/holds",
                        "name": "Justin Keller",
                        "dob": "1982-06",
                        "created_at": "2013-07-05T20:10:58.769000+00:00Z",
                        "is_identity_verified": true,
                        "refunds_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/refunds",
                        "merchant_uri": "v1/merchants/MR6xBgEkDmXbJjfgGDVpCeGb",
                        "debits_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/debits",
                        "transactions_uri": "v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/transactions",
                        "ssn_last4": "xxxx",
                        "ein": "123456789"
                    }
                },
                "response": {
                    "status": "400 BAD REQUEST",
                    "body": {
                        "status": "Bad Request",
                        "category_code": "request",
                        "description": "Invalid field [email] - \"\" must be a valid email address as specified by RFC-2822 Your request id is OHMc30bd246f8b311e29ecb026ba7f8ec28.",
                        "_uris": {},
                        "status_code": 400,
                        "category_type": "request",
                        "extras": {
                            "email": "\"\" must be a valid email address as specified by RFC-2822"
                        },
                        "request_id": "OHMc30bd246f8b311e29ecb026ba7f8ec28",
                        "additional": null
                    }
                }
            },
            "method": "PUT",
            "guru_id": "OHMc30bd246f8b311e29ecb026ba7f8ec28"
        },
        {
            "_type": "log_search",
            "endpoint": "marketplaces",
            "url": "http://api.balancedpayments.com/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-30T01:02:04.303654Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHMa6032172f8b311e2ab70026ba7cac9da",
            "status_rollup": "4XX",
            "id": "OHMa6032172f8b311e2ab70026ba7cac9da",
            "_uris": {},
            "message": {
                "date": "2013-07-30T01:02:04.303654Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY",
                    "headers": {
                        "X-Real-Ip": "50.18.199.26",
                        "User-Agent": "balanced-python/0.11.10"
                    },
                    "method": "PUT",
                    "payload": {
                        "support_email_address": "",
                        "accounts_uri": "v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts",
                        "can_cancel_transactions": false,
                        "meta": {},
                        "id": "MP5m04ORxNlNDm1bB7nkcgSY",
                        "domain_url": "https://www.nodesocket.com",
                        "can_debit_bank_accounts": true,
                        "_type": "marketplace",
                        "events_uri": "v1/events",
                        "reversals_uri": "v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/reversals",
                        "_uris": {
                            "callbacks_uri": {
                                "_type": "page",
                                "key": "callbacks"
                            },
                            "transactions_uri": {
                                "_type": "page",
                                "key": "transactions"
                            },
                            "accounts_uri": {
                                "_type": "page",
                                "key": "accounts"
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
                            "customers_uri": {
                                "_type": "page",
                                "key": "customers"
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
                        "transactions_uri": "v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/transactions",
                        "bank_accounts_uri": "v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/bank_accounts",
                        "credits_uri": "v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/credits",
                        "cards_uri": "v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/cards",
                        "in_escrow": 0,
                        "holds_uri": "v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/holds",
                        "name": "NodeSocket",
                        "can_reverse_transactions": true,
                        "support_phone_number": "+8057052440",
                        "refunds_uri": "v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/refunds",
                        "debits_uri": "v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/debits",
                        "customers_uri": "v1/customers"
                    }
                },
                "response": {
                    "status": "400 BAD REQUEST",
                    "body": {
                        "status": "Bad Request",
                        "category_code": "request",
                        "description": "Invalid field [support_email_address] - \"\" must be a valid email address as specified by RFC-2822 Your request id is OHMa6032172f8b311e2ab70026ba7cac9da.",
                        "_uris": {},
                        "status_code": 400,
                        "category_type": "request",
                        "extras": {
                            "support_email_address": "\"\" must be a valid email address as specified by RFC-2822"
                        },
                        "request_id": "OHMa6032172f8b311e2ab70026ba7cac9da",
                        "additional": null
                    }
                }
            },
            "method": "PUT",
            "guru_id": "OHMa6032172f8b311e2ab70026ba7cac9da"
        }
    ],
    "previous_uri": null,
    "uri": "/v1/logs?limit=10&method%5Bin%5D=post,put,delete&offset=0&q=&sort=created_at,desc",
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
    "total": 44,
    "next_uri": "/v1/logs?sort=created_at%2Cdesc&marketplace=MP5m04ORxNlNDm1bB7nkcgSY&q=&limit=10&method%5Bin%5D=post%2Cput%2Cdelete&offset=10",
    "id": null,
    "last_uri": "/v1/logs?sort=created_at%2Cdesc&marketplace=MP5m04ORxNlNDm1bB7nkcgSY&q=&limit=10&method%5Bin%5D=post%2Cput%2Cdelete&offset=40"
}]);