Balanced.Adapter.addFixtures([
    {
        "first_uri": "/v1/logs?marketplace=MP5m04ORxNlNDm1bB7nkcgSY&limit=10&offset=0",
        "_type": "page",
        "items": [
            {
                "_type": "log_search",
                "endpoint": "marketplaces",
                "url": "http://api.balancedpayments.com/v1/marketplaces",
                "created_at": "2013-06-28T00:25:01.737664Z",
                "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
                "uri": "/v1/logs/OHM2c0c5fd4df8911e2a42a026ba7cac9da",
                "status_rollup": "4XX",
                "id": "OHM2c0c5fd4df8911e2a42a026ba7cac9da",
                "_uris": {},
                "message": {
                    "date": "2013-06-28T00:25:01.737664Z",
                    "user_guid": "US3Bco4o18gzvcFlQZywtnpA",
                    "request": {
                        "url": "http://api.balancedpayments.com/v1/marketplaces",
                        "headers": {
                            "X-Real-Ip": "50.18.199.26",
                            "User-Agent": "balanced-python/0.11.10"
                        },
                        "method": "POST",
                        "payload": {
                            "support_phone_number": "805-705-2440",
                            "domain_url": "https://www.rentmybikes.com",
                            "support_email_address": "justin@balancedpayments.com",
                            "name": "Rent My Bikes (Production)",
                            "id": null
                        }
                    },
                    "response": {
                        "status": "409 CONFLICT",
                        "body": {
                            "status": "Conflict",
                            "category_code": "marketplace-already-created",
                            "additional": null,
                            "status_code": 409,
                            "category_type": "logical",
                            "extras": {},
                            "request_id": "OHM2c0c5fd4df8911e2a42a026ba7cac9da",
                            "description": "Marketplace already created. Your request id is OHM2c0c5fd4df8911e2a42a026ba7cac9da."
                        }
                    }
                },
                "method": "POST",
                "guru_id": "OHM2c0c5fd4df8911e2a42a026ba7cac9da"
            },
            {
                "_type": "log_search",
                "endpoint": "marketplaces",
                "url": "http://api.balancedpayments.com/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY",
                "created_at": "2013-06-28T00:30:55.273297Z",
                "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
                "uri": "/v1/logs/OHMfeca49e0df8911e2b7ba026ba7f8ec28",
                "status_rollup": "2XX",
                "id": "OHMfeca49e0df8911e2b7ba026ba7f8ec28",
                "_uris": {},
                "message": {
                    "date": "2013-06-28T00:30:55.273297Z",
                    "user_guid": "US3Bco4o18gzvcFlQZywtnpA",
                    "request": {
                        "url": "http://api.balancedpayments.com/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY",
                        "headers": {
                            "X-Real-Ip": "50.18.199.26",
                            "User-Agent": "balanced-python/0.11.10"
                        },
                        "method": "GET"
                    },
                    "response": {
                        "status": "200 OK"
                    }
                },
                "method": "GET",
                "guru_id": "OHMfeca49e0df8911e2b7ba026ba7f8ec28"
            },
            {
                "_type": "log_search",
                "endpoint": "marketplaces",
                "url": "http://api.balancedpayments.com/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY",
                "created_at": "2013-06-28T00:45:18.883644Z",
                "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
                "uri": "/v1/logs/OHM018ac2dedf8c11e2b017026ba7cd33d0",
                "status_rollup": "2XX",
                "id": "OHM018ac2dedf8c11e2b017026ba7cd33d0",
                "_uris": {},
                "message": {
                    "date": "2013-06-28T00:45:18.883644Z",
                    "user_guid": "US3Bco4o18gzvcFlQZywtnpA",
                    "request": {
                        "url": "http://api.balancedpayments.com/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY",
                        "headers": {
                            "X-Real-Ip": "50.18.199.26",
                            "User-Agent": "balanced-python/0.11.10"
                        },
                        "method": "GET"
                    },
                    "response": {
                        "status": "200 OK"
                    }
                },
                "method": "GET",
                "guru_id": "OHM018ac2dedf8c11e2b017026ba7cd33d0"
            },
            {
                "_type": "log_search",
                "endpoint": "marketplaces",
                "url": "http://api.balancedpayments.com/v1/marketplaces",
                "created_at": "2013-06-28T00:45:23.436566Z",
                "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
                "uri": "/v1/logs/OHM044159fcdf8c11e2b843026ba7c1aba6",
                "status_rollup": "2XX",
                "id": "OHM044159fcdf8c11e2b843026ba7c1aba6",
                "_uris": {},
                "message": {
                    "date": "2013-06-28T00:45:23.436566Z",
                    "user_guid": "US3Bco4o18gzvcFlQZywtnpA",
                    "request": {
                        "url": "http://api.balancedpayments.com/v1/marketplaces",
                        "headers": {
                            "X-Real-Ip": "50.18.199.26",
                            "User-Agent": "balanced-python/0.11.10"
                        },
                        "method": "GET"
                    },
                    "response": {
                        "status": "200 OK"
                    }
                },
                "method": "GET",
                "guru_id": "OHM044159fcdf8c11e2b843026ba7c1aba6"
            },
            {
                "_type": "log_search",
                "endpoint": "bank_accounts",
                "url": "http://api.balancedpayments.com/v1/customers/AC3BMbFn8ozVtCLMyski0iDl/bank_accounts?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                "created_at": "2013-06-28T01:09:59.692310Z",
                "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
                "uri": "/v1/logs/OHM742c3e14df8f11e2b017026ba7cd33d0",
                "status_rollup": "2XX",
                "id": "OHM742c3e14df8f11e2b017026ba7cd33d0",
                "_uris": {},
                "message": {
                    "date": "2013-06-28T01:09:59.692310Z",
                    "user_guid": "US3Bco4o18gzvcFlQZywtnpA",
                    "request": {
                        "url": "http://api.balancedpayments.com/v1/customers/AC3BMbFn8ozVtCLMyski0iDl/bank_accounts?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                        "headers": {
                            "X-Real-Ip": "50.18.199.26",
                            "User-Agent": "balanced-python/0.11.10"
                        },
                        "method": "GET"
                    },
                    "response": {
                        "status": "200 OK"
                    }
                },
                "method": "GET",
                "guru_id": "OHM742c3e14df8f11e2b017026ba7cd33d0"
            },
            {
                "_type": "log_search",
                "endpoint": "marketplaces",
                "url": "http://api.balancedpayments.com/v1/marketplaces",
                "created_at": "2013-06-28T01:36:13.764607Z",
                "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
                "uri": "/v1/logs/OHM1e487efadf9311e2a58e026ba7d709fe",
                "status_rollup": "2XX",
                "id": "OHM1e487efadf9311e2a58e026ba7d709fe",
                "_uris": {},
                "message": {
                    "date": "2013-06-28T01:36:13.764607Z",
                    "user_guid": "US3Bco4o18gzvcFlQZywtnpA",
                    "request": {
                        "url": "http://api.balancedpayments.com/v1/marketplaces",
                        "headers": {
                            "X-Real-Ip": "50.18.204.103",
                            "User-Agent": "balanced-python/0.11.4 dashboard/1.0.0"
                        },
                        "method": "GET"
                    },
                    "response": {
                        "status": "200 OK"
                    }
                },
                "method": "GET",
                "guru_id": "OHM1e487efadf9311e2a58e026ba7d709fe"
            },
            {
                "_type": "log_search",
                "endpoint": "bank_accounts",
                "url": "http://api.balancedpayments.com/v1/customers/AC3BMbFn8ozVtCLMyski0iDl/bank_accounts?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                "created_at": "2013-06-28T01:37:02.114228Z",
                "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
                "uri": "/v1/logs/OHM3b362364df9311e2b1ad026ba7f8ec28",
                "status_rollup": "2XX",
                "id": "OHM3b362364df9311e2b1ad026ba7f8ec28",
                "_uris": {},
                "message": {
                    "date": "2013-06-28T01:37:02.114228Z",
                    "user_guid": "US3Bco4o18gzvcFlQZywtnpA",
                    "request": {
                        "url": "http://api.balancedpayments.com/v1/customers/AC3BMbFn8ozVtCLMyski0iDl/bank_accounts?marketplace=MP5m04ORxNlNDm1bB7nkcgSY",
                        "headers": {
                            "X-Real-Ip": "50.18.199.26",
                            "User-Agent": "balanced-python/0.11.10"
                        },
                        "method": "GET"
                    },
                    "response": {
                        "status": "200 OK"
                    }
                },
                "method": "GET",
                "guru_id": "OHM3b362364df9311e2b1ad026ba7f8ec28"
            },
            {
                "_type": "log_search",
                "endpoint": "bank_accounts",
                "url": "http://api.balancedpayments.com/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC3BMbFn8ozVtCLMyski0iDl/bank_accounts?is_valid=True",
                "created_at": "2013-06-28T01:37:02.552779Z",
                "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
                "uri": "/v1/logs/OHM3b28c494df9311e284f6026ba7db2987",
                "status_rollup": "2XX",
                "id": "OHM3b28c494df9311e284f6026ba7db2987",
                "_uris": {},
                "message": {
                    "date": "2013-06-28T01:37:02.552779Z",
                    "user_guid": "US3Bco4o18gzvcFlQZywtnpA",
                    "request": {
                        "url": "http://api.balancedpayments.com/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts/AC3BMbFn8ozVtCLMyski0iDl/bank_accounts?is_valid=True",
                        "headers": {
                            "X-Real-Ip": "50.18.199.26",
                            "User-Agent": "balanced-python/0.11.4 dashboard/1.0.0"
                        },
                        "method": "GET"
                    },
                    "response": {
                        "status": "200 OK"
                    }
                },
                "method": "GET",
                "guru_id": "OHM3b28c494df9311e284f6026ba7db2987"
            },
            {
                "_type": "log_search",
                "endpoint": "accounts",
                "url": "http://api.balancedpayments.com/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts?sort=created_at%2Cdesc&limit=25&offset=0",
                "created_at": "2013-06-28T01:37:02.638979Z",
                "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
                "uri": "/v1/logs/OHM3b35acb8df9311e2846c026ba7d709fe",
                "status_rollup": "2XX",
                "id": "OHM3b35acb8df9311e2846c026ba7d709fe",
                "_uris": {},
                "message": {
                    "date": "2013-06-28T01:37:02.638979Z",
                    "user_guid": "US3Bco4o18gzvcFlQZywtnpA",
                    "request": {
                        "url": "http://api.balancedpayments.com/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts?sort=created_at%2Cdesc&limit=25&offset=0",
                        "headers": {
                            "X-Real-Ip": "50.18.204.103",
                            "User-Agent": "balanced-python/0.11.4 dashboard/1.0.0"
                        },
                        "method": "GET"
                    },
                    "response": {
                        "status": "200 OK"
                    }
                },
                "method": "GET",
                "guru_id": "OHM3b35acb8df9311e2846c026ba7d709fe"
            },
            {
                "_type": "log_search",
                "endpoint": "accounts",
                "url": "http://api.balancedpayments.com/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts",
                "created_at": "2013-06-28T01:37:00.601224Z",
                "marketplace_guid": "MP5m04ORxNlNDm1bB7nkcgSY",
                "uri": "/v1/logs/OHM3563043edf9311e2846c026ba7d709fe",
                "status_rollup": "3XX",
                "id": "OHM3563043edf9311e2846c026ba7d709fe",
                "_uris": {},
                "message": {
                    "date": "2013-06-28T01:37:00.601224Z",
                    "user_guid": "US3Bco4o18gzvcFlQZywtnpA",
                    "request": {
                        "url": "http://api.balancedpayments.com/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/accounts",
                        "headers": {
                            "X-Real-Ip": "50.18.204.103",
                            "User-Agent": "balanced-python/0.11.4 dashboard/1.0.0"
                        },
                        "method": "POST",
                        "payload": {
                            "merchant": {
                                "phone_number": "1112221234",
                                "name": "John Smith",
                                "dob": "1900-01-01",
                                "region": "",
                                "postal_code": "12345",
                                "type": "person",
                                "street_address": "1234 Main St.",
                                "tax_id": "XXXX"
                            },
                            "email_address": "john@balancedpayments.com",
                            "name": "John Smith",
                            "id": null
                        }
                    },
                    "response": {
                        "status": "300 MULTIPLE CHOICES",
                        "body": {
                            "category_code": "person-kyc",
                            "friendly_html": "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 3.2 Final//EN\">\n<title>Redirecting...</title>\n<h1>Redirecting...</h1>\n<p>You should be redirected automatically to target URL: <a href=\"https://www.balancedpayments.com/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/kyc\">https://www.balancedpayments.com/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/kyc</a>.  If not click the link.",
                            "redirect_uri": "https://www.balancedpayments.com/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/kyc",
                            "category_type": "redirect",
                            "description": "Person KYC failed."
                        }
                    }
                },
                "method": "POST",
                "guru_id": "OHM3563043edf9311e2846c026ba7d709fe"
            }
        ],
        "previous_uri": null,
        "uri": "/v1/logs",
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
        "total": 6210,
        "next_uri": "/v1/logs?marketplace=MP5m04ORxNlNDm1bB7nkcgSY&limit=10&offset=10",
        "id": null,
        "last_uri": "/v1/logs?marketplace=MP5m04ORxNlNDm1bB7nkcgSY&limit=10&offset=6200"
    }
]);