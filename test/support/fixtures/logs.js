Balanced.Adapter.addFixtures([{
    "first_uri": "/v1/logs?sort=created_at%2Cdesc&marketplace=MP5m04ORxNlNDm1bB7nkcgSY&q=&limit=20&method%5Bin%5D=post%2Cput%2Cdelete&offset=0",
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
        },
        {
            "_type": "log_search",
            "endpoint": "marketplaces",
            "url": "http://api.balancedpayments.com/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-30T01:01:43.323171Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM9984b4cef8b311e29ecb026ba7f8ec28",
            "status_rollup": "4XX",
            "id": "OHM9984b4cef8b311e29ecb026ba7f8ec28",
            "_uris": {},
            "message": {
                "date": "2013-07-30T01:01:43.323171Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY",
                    "headers": {
                        "X-Real-Ip": "50.18.204.103",
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
                        "description": "Invalid field [support_email_address] - \"\" must be a valid email address as specified by RFC-2822 Your request id is OHM9984b4cef8b311e29ecb026ba7f8ec28.",
                        "_uris": {},
                        "status_code": 400,
                        "category_type": "request",
                        "extras": {
                            "support_email_address": "\"\" must be a valid email address as specified by RFC-2822"
                        },
                        "request_id": "OHM9984b4cef8b311e29ecb026ba7f8ec28",
                        "additional": null
                    }
                }
            },
            "method": "PUT",
            "guru_id": "OHM9984b4cef8b311e29ecb026ba7f8ec28"
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
            "endpoint": "verifications",
            "url": "http://api.balancedpayments.com/v1/bank_accounts/BA1ifrc8QtTfqbRqk1tFAa0T/verifications?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-25T02:37:48.335912Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM2f39e456f4d311e2957b026ba7c1aba6",
            "status_rollup": "2XX",
            "id": "OHM2f39e456f4d311e2957b026ba7c1aba6",
            "_uris": {},
            "message": {
                "date": "2013-07-25T02:37:48.335912Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/bank_accounts/BA1ifrc8QtTfqbRqk1tFAa0T/verifications?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
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
                        "created_at": "2013-07-25T02:37:48.252032Z",
                        "uri": "/v1/bank_accounts/BA1ifrc8QtTfqbRqk1tFAa0T/verifications/BZ1vE3P7k6tXFxOGX3ugRfaC",
                        "updated_at": "2013-07-25T02:37:48.252039Z",
                        "state": "pending",
                        "_uris": {},
                        "attempts": 0,
                        "id": "BZ1vE3P7k6tXFxOGX3ugRfaC",
                        "remaining_attempts": 3
                    }
                }
            },
            "method": "POST",
            "guru_id": "OHM2f39e456f4d311e2957b026ba7c1aba6"
        },
        {
            "_type": "log_search",
            "endpoint": "bank_accounts",
            "url": "http://api.balancedpayments.com/v1/customers/CU2dmsF2ezoIf4mmqmZAj8ak/bank_accounts?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-25T02:37:36.485343Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM2981a58af4d311e2ab98026ba7d31e6f",
            "status_rollup": "2XX",
            "id": "OHM2981a58af4d311e2ab98026ba7d31e6f",
            "_uris": {},
            "message": {
                "date": "2013-07-25T02:37:36.485343Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/customers/CU2dmsF2ezoIf4mmqmZAj8ak/bank_accounts?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
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
                        "name": "NOT WORKING"
                    }
                },
                "response": {
                    "status": "201 CREATED",
                    "body": {
                        "fingerprint": "15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225",
                        "_type": "bank_account",
                        "customer": {
                            "twitter": null,
                            "meta": {},
                            "id": "CU2dmsF2ezoIf4mmqmZAj8ak",
                            "email": null,
                            "_type": "customer",
                            "source_uri": null,
                            "bank_accounts_uri": "/v1/customers/CU2dmsF2ezoIf4mmqmZAj8ak/bank_accounts",
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
                            "destination_uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts/BA1ifrc8QtTfqbRqk1tFAa0T",
                            "business_name": "NodeSocket LLC",
                            "reversals_uri": "/v1/customers/CU2dmsF2ezoIf4mmqmZAj8ak/reversals",
                            "credits_uri": "/v1/customers/CU2dmsF2ezoIf4mmqmZAj8ak/credits",
                            "cards_uri": "/v1/customers/CU2dmsF2ezoIf4mmqmZAj8ak/cards",
                            "holds_uri": "/v1/customers/CU2dmsF2ezoIf4mmqmZAj8ak/holds",
                            "name": "Justin Keller",
                            "dob": "1982-06",
                            "created_at": "2013-07-24T23:53:48.686247Z",
                            "is_identity_verified": true,
                            "uri": "/v1/customers/CU2dmsF2ezoIf4mmqmZAj8ak",
                            "refunds_uri": "/v1/customers/CU2dmsF2ezoIf4mmqmZAj8ak/refunds",
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
                            "debits_uri": "/v1/customers/CU2dmsF2ezoIf4mmqmZAj8ak/debits",
                            "transactions_uri": "/v1/customers/CU2dmsF2ezoIf4mmqmZAj8ak/transactions",
                            "ssn_last4": "xxxx",
                            "ein": "123456789"
                        },
                        "meta": {},
                        "id": "BA1ifrc8QtTfqbRqk1tFAa0T",
                        "is_valid": true,
                        "credits_uri": "/v1/bank_accounts/BA1ifrc8QtTfqbRqk1tFAa0T/credits",
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
                            "debits_uri": {
                                "_type": "page",
                                "key": "debits"
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
                        "verifications_uri": "/v1/bank_accounts/BA1ifrc8QtTfqbRqk1tFAa0T/verifications",
                        "routing_number": "322271627",
                        "verification_uri": null,
                        "transactions_uri": "/v1/bank_accounts/BA1ifrc8QtTfqbRqk1tFAa0T/transactions",
                        "name": "NOT WORKING",
                        "can_credit": true,
                        "created_at": "2013-07-25T02:37:36.326769Z",
                        "uri": "/v1/customers/CU2dmsF2ezoIf4mmqmZAj8ak/bank_accounts/BA1ifrc8QtTfqbRqk1tFAa0T",
                        "debits_uri": "/v1/bank_accounts/BA1ifrc8QtTfqbRqk1tFAa0T/debits",
                        "account_number": "xxxxx6789"
                    }
                }
            },
            "method": "POST",
            "guru_id": "OHM2981a58af4d311e2ab98026ba7d31e6f"
        },
        {
            "_type": "log_search",
            "endpoint": "verifications",
            "url": "http://api.balancedpayments.com/v1/bank_accounts/BA4r7ry0zSG8fIxGaMtIzwN9/verifications?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-25T00:23:20.990722Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM6748b5f6f4c011e2af42026ba7cac9da",
            "status_rollup": "2XX",
            "id": "OHM6748b5f6f4c011e2af42026ba7cac9da",
            "_uris": {},
            "message": {
                "date": "2013-07-25T00:23:20.990722Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/bank_accounts/BA4r7ry0zSG8fIxGaMtIzwN9/verifications?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
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
                        "uri": "/v1/bank_accounts/BA4r7ry0zSG8fIxGaMtIzwN9/verifications/BZ3bTbyYn1WGGfFmhaipv5CW",
                        "attempts": 0,
                        "_uris": {},
                        "id": "BZ3bTbyYn1WGGfFmhaipv5CW",
                        "remaining_attempts": 3
                    }
                }
            },
            "method": "POST",
            "guru_id": "OHM6748b5f6f4c011e2af42026ba7cac9da"
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
            "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications/BZ4WJZUrCUN56WMylceCgAb0?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-25T00:21:02.835770Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM16c5c344f4c011e2b8f1026ba7d31e6f",
            "status_rollup": "4XX",
            "id": "OHM16c5c344f4c011e2b8f1026ba7d31e6f",
            "_uris": {},
            "message": {
                "date": "2013-07-25T00:21:02.835770Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications/BZ4WJZUrCUN56WMylceCgAb0?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                    "headers": {
                        "X-Real-Ip": "50.18.204.103",
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
                        "id": "BZ4WJZUrCUN56WMylceCgAb0",
                        "remaining_attempts": 1
                    }
                },
                "response": {
                    "status": "409 CONFLICT",
                    "body": {
                        "status": "Conflict",
                        "category_code": "bank-account-authentication-failed",
                        "description": "Authentication amounts do not match. Your request id is OHM16c5c344f4c011e2b8f1026ba7d31e6f.",
                        "_uris": {},
                        "status_code": 409,
                        "category_type": "logical",
                        "extras": {},
                        "request_id": "OHM16c5c344f4c011e2b8f1026ba7d31e6f",
                        "additional": null
                    }
                }
            },
            "method": "PUT",
            "guru_id": "OHM16c5c344f4c011e2b8f1026ba7d31e6f"
        },
        {
            "_type": "log_search",
            "endpoint": "verifications",
            "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications/BZ4WJZUrCUN56WMylceCgAb0?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-25T00:21:01.147774Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM15bec874f4c011e2a587026ba7cd33d0",
            "status_rollup": "4XX",
            "id": "OHM15bec874f4c011e2a587026ba7cd33d0",
            "_uris": {},
            "message": {
                "date": "2013-07-25T00:21:01.147774Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications/BZ4WJZUrCUN56WMylceCgAb0?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                    "headers": {
                        "X-Real-Ip": "50.18.204.103",
                        "User-Agent": "balanced-python/0.11.10"
                    },
                    "method": "PUT",
                    "payload": {
                        "errorStatusCode": 409,
                        "_type": "bank_account_authentication",
                        "_uris": {},
                        "state": "pending",
                        "amount_1": "1",
                        "attempts": 1,
                        "amount_2": "1",
                        "id": "BZ4WJZUrCUN56WMylceCgAb0",
                        "remaining_attempts": 2
                    }
                },
                "response": {
                    "status": "409 CONFLICT",
                    "body": {
                        "status": "Conflict",
                        "category_code": "bank-account-authentication-failed",
                        "description": "Authentication amounts do not match. Your request id is OHM15bec874f4c011e2a587026ba7cd33d0.",
                        "_uris": {},
                        "status_code": 409,
                        "category_type": "logical",
                        "extras": {},
                        "request_id": "OHM15bec874f4c011e2a587026ba7cd33d0",
                        "additional": null
                    }
                }
            },
            "method": "PUT",
            "guru_id": "OHM15bec874f4c011e2a587026ba7cd33d0"
        },
        {
            "_type": "log_search",
            "endpoint": "verifications",
            "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications/BZ4WJZUrCUN56WMylceCgAb0?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-25T00:20:59.607528Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM14d4e11ef4c011e2951f026ba7cd33d0",
            "status_rollup": "4XX",
            "id": "OHM14d4e11ef4c011e2951f026ba7cd33d0",
            "_uris": {},
            "message": {
                "date": "2013-07-25T00:20:59.607528Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications/BZ4WJZUrCUN56WMylceCgAb0?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                    "headers": {
                        "X-Real-Ip": "50.18.204.103",
                        "User-Agent": "balanced-python/0.11.10"
                    },
                    "method": "PUT",
                    "payload": {
                        "_type": "bank_account_authentication",
                        "_uris": {},
                        "state": "pending",
                        "amount_1": "1",
                        "attempts": 0,
                        "amount_2": "1",
                        "id": "BZ4WJZUrCUN56WMylceCgAb0",
                        "remaining_attempts": 3
                    }
                },
                "response": {
                    "status": "409 CONFLICT",
                    "body": {
                        "status": "Conflict",
                        "category_code": "bank-account-authentication-failed",
                        "description": "Authentication amounts do not match. Your request id is OHM14d4e11ef4c011e2951f026ba7cd33d0.",
                        "_uris": {},
                        "status_code": 409,
                        "category_type": "logical",
                        "extras": {},
                        "request_id": "OHM14d4e11ef4c011e2951f026ba7cd33d0",
                        "additional": null
                    }
                }
            },
            "method": "PUT",
            "guru_id": "OHM14d4e11ef4c011e2951f026ba7cd33d0"
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
        }
    ],
    "previous_uri": null,
    "uri": "/v1/logs?limit=20&method%5Bin%5D=post,put,delete&offset=0&q=&sort=created_at,desc",
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
    "limit": 20,
    "offset": 0,
    "counts": null,
    "total": 44,
    "next_uri": "/v1/logs?sort=created_at%2Cdesc&marketplace=MP5m04ORxNlNDm1bB7nkcgSY&q=&limit=20&method%5Bin%5D=post%2Cput%2Cdelete&offset=20",
    "id": null,
    "last_uri": "/v1/logs?sort=created_at%2Cdesc&marketplace=MP5m04ORxNlNDm1bB7nkcgSY&q=&limit=20&method%5Bin%5D=post%2Cput%2Cdelete&offset=40"
},
{
    "first_uri": "/v1/logs?sort=created_at%2Cdesc&marketplace=MP5m04ORxNlNDm1bB7nkcgSY&q=&limit=20&method%5Bin%5D=post%2Cput%2Cdelete&offset=0",
    "_type": "page",
    "items": [
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
            "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications/BZ3BCZWTcdmldA7i2PP00axw?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-24T23:48:42.298162Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM9219d652f4bb11e29c7a026ba7cac9da",
            "status_rollup": "4XX",
            "id": "OHM9219d652f4bb11e29c7a026ba7cac9da",
            "_uris": {},
            "message": {
                "date": "2013-07-24T23:48:42.298162Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications/BZ3BCZWTcdmldA7i2PP00axw?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                    "headers": {
                        "X-Real-Ip": "50.18.204.103",
                        "User-Agent": "balanced-python/0.11.10"
                    },
                    "method": "PUT",
                    "payload": {
                        "errorStatusCode": 409,
                        "_type": "bank_account_authentication",
                        "_uris": {},
                        "state": "pending",
                        "amount_1": "1",
                        "attempts": 1,
                        "amount_2": "1",
                        "id": "BZ3BCZWTcdmldA7i2PP00axw",
                        "remaining_attempts": 2
                    }
                },
                "response": {
                    "status": "409 CONFLICT",
                    "body": {
                        "status": "Conflict",
                        "category_code": "bank-account-authentication-failed",
                        "description": "Authentication amounts do not match. Your request id is OHM9219d652f4bb11e29c7a026ba7cac9da.",
                        "_uris": {},
                        "status_code": 409,
                        "category_type": "logical",
                        "extras": {},
                        "request_id": "OHM9219d652f4bb11e29c7a026ba7cac9da",
                        "additional": null
                    }
                }
            },
            "method": "PUT",
            "guru_id": "OHM9219d652f4bb11e29c7a026ba7cac9da"
        },
        {
            "_type": "log_search",
            "endpoint": "verifications",
            "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications/BZ3BCZWTcdmldA7i2PP00axw?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-24T23:48:36.928909Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM8eeb89eef4bb11e28c0d026ba7f8ec28",
            "status_rollup": "4XX",
            "id": "OHM8eeb89eef4bb11e28c0d026ba7f8ec28",
            "_uris": {},
            "message": {
                "date": "2013-07-24T23:48:36.928909Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications/BZ3BCZWTcdmldA7i2PP00axw?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                    "headers": {
                        "X-Real-Ip": "50.18.199.26",
                        "User-Agent": "balanced-python/0.11.10"
                    },
                    "method": "PUT",
                    "payload": {
                        "_type": "bank_account_authentication",
                        "_uris": {},
                        "state": "pending",
                        "amount_1": "1",
                        "attempts": 0,
                        "amount_2": "1",
                        "id": "BZ3BCZWTcdmldA7i2PP00axw",
                        "remaining_attempts": 3
                    }
                },
                "response": {
                    "status": "409 CONFLICT",
                    "body": {
                        "status": "Conflict",
                        "category_code": "bank-account-authentication-failed",
                        "description": "Authentication amounts do not match. Your request id is OHM8eeb89eef4bb11e28c0d026ba7f8ec28.",
                        "_uris": {},
                        "status_code": 409,
                        "category_type": "logical",
                        "extras": {},
                        "request_id": "OHM8eeb89eef4bb11e28c0d026ba7f8ec28",
                        "additional": null
                    }
                }
            },
            "method": "PUT",
            "guru_id": "OHM8eeb89eef4bb11e28c0d026ba7f8ec28"
        },
        {
            "_type": "log_search",
            "endpoint": "verifications",
            "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-24T23:47:56.079097Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM7613d976f4bb11e292f7026ba7c1aba6",
            "status_rollup": "2XX",
            "id": "OHM7613d976f4bb11e292f7026ba7c1aba6",
            "_uris": {},
            "message": {
                "date": "2013-07-24T23:47:56.079097Z",
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
                        "uri": "/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications/BZ3BCZWTcdmldA7i2PP00axw",
                        "attempts": 0,
                        "_uris": {},
                        "id": "BZ3BCZWTcdmldA7i2PP00axw",
                        "remaining_attempts": 3
                    }
                }
            },
            "method": "POST",
            "guru_id": "OHM7613d976f4bb11e292f7026ba7c1aba6"
        },
        {
            "_type": "log_search",
            "endpoint": "bank_accounts",
            "url": "http://api.balancedpayments.com/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-24T23:26:09.613277Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM6b70a182f4b811e2ae20026ba7c1aba6",
            "status_rollup": "2XX",
            "id": "OHM6b70a182f4b811e2ae20026ba7c1aba6",
            "_uris": {},
            "message": {
                "date": "2013-07-24T23:26:09.613277Z",
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
                        "account_number": "XXXXXXXXXX",
                        "type": "checking",
                        "id": null,
                        "name": "Chase Business (REAL)"
                    }
                },
                "response": {
                    "status": "201 CREATED",
                    "body": {
                        "fingerprint": "b140ab4a3178352fda3da5eb5bae188fff26b02689540b72fdfbddb6d1e8a2c2",
                        "_type": "bank_account",
                        "customer": null,
                        "meta": {},
                        "id": "BA3htREei0Tt9mWLQ0MU5IDI",
                        "is_valid": true,
                        "credits_uri": "/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/credits",
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
                            "debits_uri": {
                                "_type": "page",
                                "key": "debits"
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
                        "last_four": "8012",
                        "default_credit": true,
                        "can_debit": false,
                        "verifications_uri": "/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/verifications",
                        "routing_number": "322271627",
                        "verification_uri": null,
                        "transactions_uri": "/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/transactions",
                        "name": "Chase Business (REAL)",
                        "can_credit": true,
                        "created_at": "2013-07-24T23:26:09.494743Z",
                        "uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI",
                        "debits_uri": "/v1/bank_accounts/BA3htREei0Tt9mWLQ0MU5IDI/debits",
                        "account_number": "xxxxxx8012"
                    }
                }
            },
            "method": "POST",
            "guru_id": "OHM6b70a182f4b811e2ae20026ba7c1aba6"
        },
        {
            "_type": "log_search",
            "endpoint": "marketplaces",
            "url": "http://api.balancedpayments.com/v1/marketplaces?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-24T01:16:37.525019Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHMb007707ef3fe11e286c1026ba7f8ec28",
            "status_rollup": "4XX",
            "id": "OHMb007707ef3fe11e286c1026ba7f8ec28",
            "_uris": {},
            "message": {
                "date": "2013-07-24T01:16:37.525019Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/marketplaces?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
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
                    "status": "409 CONFLICT",
                    "body": {
                        "status": "Conflict",
                        "category_code": "marketplace-already-created",
                        "description": "Marketplace already created. Your request id is OHMb007707ef3fe11e286c1026ba7f8ec28.",
                        "_uris": {},
                        "status_code": 409,
                        "category_type": "logical",
                        "extras": {},
                        "request_id": "OHMb007707ef3fe11e286c1026ba7f8ec28",
                        "additional": null
                    }
                }
            },
            "method": "POST",
            "guru_id": "OHMb007707ef3fe11e286c1026ba7f8ec28"
        },
        {
            "_type": "log_search",
            "endpoint": "api_keys",
            "url": "http://api.balancedpayments.com/v1/api_keys?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-24T01:16:37.330146Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHMafec6d60f3fe11e29eb0026ba7cd33d0",
            "status_rollup": "2XX",
            "id": "OHMafec6d60f3fe11e29eb0026ba7cd33d0",
            "_uris": {},
            "message": {
                "date": "2013-07-24T01:16:37.330146Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/api_keys?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
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
                        "_type": "api_key",
                        "_uris": {},
                        "created_at": "2013-07-24T01:16:37.238742Z",
                        "uri": "/v1/api_keys/AK5lRsuSNzynZQkLV7dPncDm",
                        "secret": "afde8e0cf3fe11e29eb0026ba7cd33d0",
                        "meta": {},
                        "id": "AK5lRsuSNzynZQkLV7dPncDm"
                    }
                }
            },
            "method": "POST",
            "guru_id": "OHMafec6d60f3fe11e29eb0026ba7cd33d0"
        },
        {
            "_type": "log_search",
            "endpoint": "bank_accounts",
            "url": "http://api.balancedpayments.com/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-23T23:06:55.968604Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM915851b4f3ec11e282e5026ba7d31e6f",
            "status_rollup": "2XX",
            "id": "OHM915851b4f3ec11e282e5026ba7d31e6f",
            "_uris": {},
            "message": {
                "date": "2013-07-23T23:06:55.968604Z",
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
                        "name": "NEW TEST",
                        "account_number": "XXXXXXXXX",
                        "validationErrors": {
                            "routing_number": "\"123456789\" is not a valid bank code routing number"
                        },
                        "type": "checking",
                        "id": null
                    }
                },
                "response": {
                    "status": "201 CREATED",
                    "body": {
                        "fingerprint": "15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225",
                        "_type": "bank_account",
                        "customer": null,
                        "meta": {},
                        "id": "BA4r7ry0zSG8fIxGaMtIzwN9",
                        "is_valid": true,
                        "credits_uri": "/v1/bank_accounts/BA4r7ry0zSG8fIxGaMtIzwN9/credits",
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
                        "verifications_uri": "/v1/bank_accounts/BA4r7ry0zSG8fIxGaMtIzwN9/verifications",
                        "routing_number": "322271627",
                        "verification_uri": null,
                        "transactions_uri": "/v1/bank_accounts/BA4r7ry0zSG8fIxGaMtIzwN9/transactions",
                        "name": "NEW TEST",
                        "can_credit": true,
                        "created_at": "2013-07-23T23:06:55.844551Z",
                        "uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts/BA4r7ry0zSG8fIxGaMtIzwN9",
                        "account_number": "xxxxx6789"
                    }
                }
            },
            "method": "POST",
            "guru_id": "OHM915851b4f3ec11e282e5026ba7d31e6f"
        },
        {
            "_type": "log_search",
            "endpoint": "bank_accounts",
            "url": "http://api.balancedpayments.com/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-23T23:06:36.504026Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM8637b928f3ec11e2b7ec026ba7c1aba6",
            "status_rollup": "4XX",
            "id": "OHM8637b928f3ec11e2b7ec026ba7c1aba6",
            "_uris": {},
            "message": {
                "date": "2013-07-23T23:06:36.504026Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                    "headers": {
                        "X-Real-Ip": "50.18.204.103",
                        "User-Agent": "balanced-python/0.11.10"
                    },
                    "method": "POST",
                    "payload": {
                        "routing_number": "123456789",
                        "account_number": "XXXXXXXXX",
                        "type": "checking",
                        "id": null,
                        "name": "NEW TEST"
                    }
                },
                "response": {
                    "status": "400 BAD REQUEST",
                    "body": {
                        "status": "Bad Request",
                        "category_code": "request",
                        "description": "Invalid field [routing_number] - \"123456789\" is not a valid bank code routing number Your request id is OHM8637b928f3ec11e2b7ec026ba7c1aba6.",
                        "_uris": {},
                        "status_code": 400,
                        "category_type": "request",
                        "extras": {
                            "routing_number": "\"123456789\" is not a valid bank code routing number"
                        },
                        "request_id": "OHM8637b928f3ec11e2b7ec026ba7c1aba6",
                        "additional": null
                    }
                }
            },
            "method": "POST",
            "guru_id": "OHM8637b928f3ec11e2b7ec026ba7c1aba6"
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
            "url": "http://api.balancedpayments.com/v1/bank_accounts/BA5VRdsnaMZFSog3pqL22VAe/verifications?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-22T23:23:49.948000Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHMc338a7f0f32511e28144026ba7d31e6f",
            "status_rollup": "2XX",
            "id": "OHMc338a7f0f32511e28144026ba7d31e6f",
            "_uris": {},
            "message": {
                "date": "2013-07-22T23:23:49.948000Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/bank_accounts/BA5VRdsnaMZFSog3pqL22VAe/verifications?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
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
                        "uri": "/v1/bank_accounts/BA5VRdsnaMZFSog3pqL22VAe/verifications/BZ5XfpfTZTJWTgbPNJFnywAT",
                        "attempts": 0,
                        "_uris": {},
                        "id": "BZ5XfpfTZTJWTgbPNJFnywAT",
                        "remaining_attempts": 3
                    }
                }
            },
            "method": "POST",
            "guru_id": "OHMc338a7f0f32511e28144026ba7d31e6f"
        },
        {
            "_type": "log_search",
            "endpoint": "bank_accounts",
            "url": "http://api.balancedpayments.com/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-22T23:23:48.612249Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHMc297dbccf32511e29ed6026ba7cac9da",
            "status_rollup": "2XX",
            "id": "OHMc297dbccf32511e29ed6026ba7cac9da",
            "_uris": {},
            "message": {
                "date": "2013-07-22T23:23:48.612249Z",
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
                        "id": "BA5VRdsnaMZFSog3pqL22VAe",
                        "is_valid": true,
                        "credits_uri": "/v1/bank_accounts/BA5VRdsnaMZFSog3pqL22VAe/credits",
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
                        "verifications_uri": "/v1/bank_accounts/BA5VRdsnaMZFSog3pqL22VAe/verifications",
                        "routing_number": "322271627",
                        "verification_uri": null,
                        "transactions_uri": "/v1/bank_accounts/BA5VRdsnaMZFSog3pqL22VAe/transactions",
                        "name": "Justin Keller",
                        "can_credit": true,
                        "created_at": "2013-07-22T23:23:48.461484Z",
                        "uri": "/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts/BA5VRdsnaMZFSog3pqL22VAe",
                        "account_number": "xxxxx6789"
                    }
                }
            },
            "method": "POST",
            "guru_id": "OHMc297dbccf32511e29ed6026ba7cac9da"
        },
        {
            "_type": "log_search",
            "endpoint": "bank_accounts",
            "url": "http://api.balancedpayments.com/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts/BA3GJuPQtalOstj1ZOqHn6eX?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-22T23:22:56.463620Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHMa3f509c4f32511e2812f026ba7c1aba6",
            "status_rollup": "2XX",
            "id": "OHMa3f509c4f32511e2812f026ba7c1aba6",
            "_uris": {},
            "message": {
                "date": "2013-07-22T23:22:56.463620Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/customers/AC3ufGxx2hKgI0pzjzgbxtm/bank_accounts/BA3GJuPQtalOstj1ZOqHn6eX?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                    "headers": {
                        "X-Real-Ip": "50.18.199.26",
                        "User-Agent": "balanced-python/0.11.10"
                    },
                    "method": "DELETE"
                },
                "response": {
                    "status": "204 NO CONTENT",
                    "body": {
                        "routing_number": "322271627",
                        "bank_name": "J.P. MORGAN CHASE BANK, N.A.",
                        "_type": "bank_account",
                        "transactions_uri": "/v1/bank_accounts/BA3GJuPQtalOstj1ZOqHn6eX/transactions",
                        "name": "Justin Keller",
                        "can_credit": true,
                        "can_debit": false,
                        "default_credit": false,
                        "can_hold": false,
                        "default_debit": false,
                        "_uris": {
                            "transactions_uri": {
                                "_type": "page",
                                "key": "transactions"
                            }
                        },
                        "meta": {},
                        "account_number": "xxxxx6789",
                        "fingerprint": "15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225",
                        "type": "checking"
                    }
                }
            },
            "method": "DELETE",
            "guru_id": "OHMa3f509c4f32511e2812f026ba7c1aba6"
        },
        {
            "_type": "log_search",
            "endpoint": "verifications",
            "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3GJuPQtalOstj1ZOqHn6eX/verifications",
            "created_at": "2013-07-22T23:14:25.035669Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM7319275af32411e294cf026ba7cd33d0",
            "status_rollup": "4XX",
            "id": "OHM7319275af32411e294cf026ba7cd33d0",
            "_uris": {},
            "message": {
                "date": "2013-07-22T23:14:25.035669Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3GJuPQtalOstj1ZOqHn6eX/verifications",
                    "headers": {
                        "X-Real-Ip": "199.241.202.99",
                        "User-Agent": "curl/7.24.0 (x86_64-apple-darwin12.0) libcurl/7.24.0 OpenSSL/0.9.8x zlib/1.2.5"
                    },
                    "method": "POST"
                },
                "response": {
                    "status": "409 CONFLICT",
                    "body": {
                        "status": "Conflict",
                        "category_code": "bank-account-authentication-already-exists",
                        "description": "Pending authentication for BA3GJuPQtalOstj1ZOqHn6eX already exists. Your request id is OHM7319275af32411e294cf026ba7cd33d0.",
                        "_uris": {},
                        "status_code": 409,
                        "category_type": "logical",
                        "extras": {},
                        "request_id": "OHM7319275af32411e294cf026ba7cd33d0",
                        "additional": null
                    }
                }
            },
            "method": "POST",
            "guru_id": "OHM7319275af32411e294cf026ba7cd33d0"
        },
        {
            "_type": "log_search",
            "endpoint": "verifications",
            "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3GJuPQtalOstj1ZOqHn6eX/verifications",
            "created_at": "2013-07-22T23:11:32.852984Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM0bc24474f32411e29f6c026ba7cd33d0",
            "status_rollup": "2XX",
            "id": "OHM0bc24474f32411e29f6c026ba7cd33d0",
            "_uris": {},
            "message": {
                "date": "2013-07-22T23:11:32.852984Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3GJuPQtalOstj1ZOqHn6eX/verifications",
                    "headers": {
                        "X-Real-Ip": "199.241.202.99",
                        "User-Agent": "curl/7.24.0 (x86_64-apple-darwin12.0) libcurl/7.24.0 OpenSSL/0.9.8x zlib/1.2.5"
                    },
                    "method": "POST"
                },
                "response": {
                    "status": "201 CREATED",
                    "body": {
                        "_type": "bank_account_authentication",
                        "state": "pending",
                        "uri": "/v1/bank_accounts/BA3GJuPQtalOstj1ZOqHn6eX/verifications/BZn0jnbVJFpHRlOLqnunAkw",
                        "attempts": 0,
                        "_uris": {},
                        "id": "BZn0jnbVJFpHRlOLqnunAkw",
                        "remaining_attempts": 3
                    }
                }
            },
            "method": "POST",
            "guru_id": "OHM0bc24474f32411e29f6c026ba7cd33d0"
        },
        {
            "_type": "log_search",
            "endpoint": "verifications",
            "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3GJuPQtalOstj1ZOqHn6eX/verifications/BZ3Id7dzTwISb8XlR3jpxbiU?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-22T23:03:55.237601Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHMfbb693e2f32211e2869c026ba7f8ec28",
            "status_rollup": "4XX",
            "id": "OHMfbb693e2f32211e2869c026ba7f8ec28",
            "_uris": {},
            "message": {
                "date": "2013-07-22T23:03:55.237601Z",
                "user_guid": "US6xxiHRw623lKxcw1uewqDR",
                "request": {
                    "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3GJuPQtalOstj1ZOqHn6eX/verifications/BZ3Id7dzTwISb8XlR3jpxbiU?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                    "headers": {
                        "X-Real-Ip": "50.18.204.103",
                        "User-Agent": "balanced-python/0.11.10"
                    },
                    "method": "PUT",
                    "payload": {
                        "_type": "bank_account_authentication",
                        "_uris": {},
                        "state": "failed",
                        "amount_1": "34",
                        "attempts": 3,
                        "amount_2": "36",
                        "id": "BZ3Id7dzTwISb8XlR3jpxbiU",
                        "remaining_attempts": 0
                    }
                },
                "response": {
                    "status": "409 CONFLICT",
                    "body": {
                        "status": "Conflict",
                        "category_code": "bank-account-authentication-not-pending",
                        "description": "Authentication is not pending. Your request id is OHMfbb693e2f32211e2869c026ba7f8ec28.",
                        "_uris": {},
                        "status_code": 409,
                        "category_type": "logical",
                        "extras": {},
                        "request_id": "OHMfbb693e2f32211e2869c026ba7f8ec28",
                        "additional": null
                    }
                }
            },
            "method": "PUT",
            "guru_id": "OHMfbb693e2f32211e2869c026ba7f8ec28"
        },
        {
            "_type": "log_search",
            "endpoint": "verifications",
            "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3GJuPQtalOstj1ZOqHn6eX/verifications/BZ3Id7dzTwISb8XlR3jpxbiU?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-22T23:03:19.832915Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHMe69eacbaf32211e28144026ba7d31e6f",
            "status_rollup": "4XX",
            "id": "OHMe69eacbaf32211e28144026ba7d31e6f",
            "_uris": {},
            "message": {
                "date": "2013-07-22T23:03:19.832915Z",
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
                        "state": "failed",
                        "amount_1": "34",
                        "attempts": 3,
                        "amount_2": "34",
                        "id": "BZ3Id7dzTwISb8XlR3jpxbiU",
                        "remaining_attempts": 0
                    }
                },
                "response": {
                    "status": "409 CONFLICT",
                    "body": {
                        "status": "Conflict",
                        "category_code": "bank-account-authentication-not-pending",
                        "description": "Authentication is not pending. Your request id is OHMe69eacbaf32211e28144026ba7d31e6f.",
                        "_uris": {},
                        "status_code": 409,
                        "category_type": "logical",
                        "extras": {},
                        "request_id": "OHMe69eacbaf32211e28144026ba7d31e6f",
                        "additional": null
                    }
                }
            },
            "method": "PUT",
            "guru_id": "OHMe69eacbaf32211e28144026ba7d31e6f"
        },
        {
            "_type": "log_search",
            "endpoint": "verifications",
            "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3GJuPQtalOstj1ZOqHn6eX/verifications/BZ3Id7dzTwISb8XlR3jpxbiU?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-22T23:00:49.513401Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM8cfd7060f32211e28797026ba7d31e6f",
            "status_rollup": "4XX",
            "id": "OHM8cfd7060f32211e28797026ba7d31e6f",
            "_uris": {},
            "message": {
                "date": "2013-07-22T23:00:49.513401Z",
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
                        "amount_1": "23",
                        "attempts": 0,
                        "amount_2": "67",
                        "id": "BZ3Id7dzTwISb8XlR3jpxbiU",
                        "remaining_attempts": 3
                    }
                },
                "response": {
                    "status": "409 CONFLICT",
                    "body": {
                        "status": "Conflict",
                        "category_code": "bank-account-authentication-failed",
                        "description": "Authentication amounts do not match. Your request id is OHM8cfd7060f32211e28797026ba7d31e6f.",
                        "_uris": {},
                        "status_code": 409,
                        "category_type": "logical",
                        "extras": {},
                        "request_id": "OHM8cfd7060f32211e28797026ba7d31e6f",
                        "additional": null
                    }
                }
            },
            "method": "PUT",
            "guru_id": "OHM8cfd7060f32211e28797026ba7d31e6f"
        },
        {
            "_type": "log_search",
            "endpoint": "verifications",
            "url": "http://api.balancedpayments.com/v1/bank_accounts/BA3GJuPQtalOstj1ZOqHn6eX/verifications/BZ3Id7dzTwISb8XlR3jpxbiU?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
            "created_at": "2013-07-22T23:00:42.163682Z",
            "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
            "uri": "/v1/logs/OHM889025b8f32211e294cf026ba7cd33d0",
            "status_rollup": "4XX",
            "id": "OHM889025b8f32211e294cf026ba7cd33d0",
            "_uris": {},
            "message": {
                "date": "2013-07-22T23:00:42.163682Z",
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
                        "amount_1": "34",
                        "attempts": 0,
                        "amount_2": "36",
                        "id": "BZ3Id7dzTwISb8XlR3jpxbiU",
                        "remaining_attempts": 3
                    }
                },
                "response": {
                    "status": "409 CONFLICT",
                    "body": {
                        "status": "Conflict",
                        "category_code": "bank-account-authentication-failed",
                        "description": "Authentication amounts do not match. Your request id is OHM889025b8f32211e294cf026ba7cd33d0.",
                        "_uris": {},
                        "status_code": 409,
                        "category_type": "logical",
                        "extras": {},
                        "request_id": "OHM889025b8f32211e294cf026ba7cd33d0",
                        "additional": null
                    }
                }
            },
            "method": "PUT",
            "guru_id": "OHM889025b8f32211e294cf026ba7cd33d0"
        }
    ],
    "previous_uri": "/v1/logs?sort=created_at%2Cdesc&marketplace=MP5m04ORxNlNDm1bB7nkcgSY&q=&limit=20&method%5Bin%5D=post%2Cput%2Cdelete&offset=0",
    "uri": "/v1/logs?sort=created_at%2Cdesc&marketplace=MP5m04ORxNlNDm1bB7nkcgSY&q=&limit=20&method%5Bin%5D=post%2Cput%2Cdelete&offset=20",
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
    "limit": 20,
    "offset": 20,
    "counts": null,
    "total": 44,
    "next_uri": "/v1/logs?sort=created_at%2Cdesc&marketplace=MP5m04ORxNlNDm1bB7nkcgSY&q=&limit=20&method%5Bin%5D=post%2Cput%2Cdelete&offset=40",
    "id": null,
    "last_uri": "/v1/logs?sort=created_at%2Cdesc&marketplace=MP5m04ORxNlNDm1bB7nkcgSY&q=&limit=20&method%5Bin%5D=post%2Cput%2Cdelete&offset=40"
}]);