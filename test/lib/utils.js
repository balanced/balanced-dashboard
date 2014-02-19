var Testing = {
	marketplace: null,

	// constant ids
	MARKETPLACE_ID: null,
	CARD_ID: null,
	BANK_ACCOUNT_ID: null,
	CREDIT_ID: null,
	CUSTOMER_ID: null,
	DEBIT_ID: null,
	REVERSAL_ID: null,

	// constant routes
	MARKETPLACES_ROUTE: '/marketplaces',
	ACTIVITY_ROUTE: null,
	ADD_CUSTOMER_ROUTE: null,
	BANK_ACCOUNT_ROUTE: null,
	CARD_ROUTE: null,
	CREDIT_ROUTE: null,
	CUSTOMER_ROUTE: null,
	DEBIT_ROUTE: null,
	REVERSAL_ROUTE: null,

	isStopped: false,

	stop: function() {
		if (this.isStopped) {
			return;
		}

		stop();
		this.isStopped = true;
	},

	start: function() {
		if (!this.isStopped) {
			return;
		}

		start();
		this.isStopped = false;
	},

	selectMarketplaceByName: function(name) {
		name = name || 'Test Marketplace';
		$('#marketplaces ul a:contains("' + name + '")').click();
	},

	runSearch: function(query) {
		$('#q').val(query).trigger('keyup');
		// Press enter to run the search immediately
		$("#q").trigger(jQuery.Event("keyup", {
			keyCode: Balanced.KEYS.ENTER
		}));
	},

	// use the fixture adapter
	setupFixtures: function() {
		Balanced.Adapter = Balanced.FixtureAdapter.create();
		window.setupTestFixtures();
	},

	fixtureLogin: function() {
		var _this = this;
		Ember.run(function() {
			var userId = _this.FIXTURE_USER_ROUTE = '/users/USeb4a5d6ca6ed11e2bea6026ba7db2987';
			Balanced.Auth.setAuthProperties(
				true,
				Balanced.User.find(userId),
				userId,
				userId,
				false);

			_this.FIXTURE_USER_EMAIL = Balanced.Auth.user.email_address;
		});
	},

	logout: function() {
		Ember.run(function() {
			Balanced.Auth.setAuthProperties(false, null, null, null, false);
		});
	},

	// build up test fixtures
	setupMarketplace: function() {
		var _this = this;
		Ember.run(function() {
			return Balanced.NET.loadCSRFTokenIfNotLoaded(function() {
				return Balanced.Auth.createNewGuestUser().then(function() {
					return Balanced.Marketplace.create().save();
				}).then(function(marketplace) {
					_this.marketplace = marketplace;
					Balanced.Auth.setupGuestUserMarketplace(marketplace);

					_this.MARKETPLACE_ID = marketplace.get('uri').split('/').pop();
					_this.CUSTOMER_ID = marketplace.get('owner_customer_uri').split('/').pop();
					_this.MARKETPLACES_ROUTE = '/marketplaces';
					_this.MARKETPLACE_ROUTE = '/marketplaces/' + _this.MARKETPLACE_ID;
					_this.ACTIVITY_ROUTE = '/marketplaces/' + _this.MARKETPLACE_ID + '/activity/transactions';
					_this.ADD_CUSTOMER_ROUTE = '/marketplaces/' + _this.MARKETPLACE_ID + '/add_customer';
					_this.CUSTOMER_ROUTE = '/marketplaces/' + _this.MARKETPLACE_ID + '/customers/' + _this.CUSTOMER_ID;
					_this.LOGS_ROUTE = '/marketplaces/' + _this.MARKETPLACE_ID + '/logs';
					_this.SETTINGS_ROUTE = '/marketplaces/' + _this.MARKETPLACE_ID + '/settings';
					_this.INITIAL_DEPOSIT_ROUTE = '/marketplaces/' + _this.MARKETPLACE_ID + '/initial_deposit';
				});
			});
		});
	},

	_createCard: function() {
		var _this = this;
		return Balanced.Card.create({
			uri: '/customers/' + this.CUSTOMER_ID + '/cards',
			number: '4444400012123434',
			name: 'Test Card',
			expiration_year: 2020,
			expiration_month: 11
		}).save().then(function(card) {
			_this.CARD_ID = card.get('id');
			_this.CARD_ROUTE = _this.MARKETPLACE_ROUTE +
				'/cards/' + _this.CARD_ID;
			return card;
		});
	},

	_createDisputeCard: function() {
		var _this = this;
		return Balanced.Card.create({
			uri: '/customers/' + this.CUSTOMER_ID + '/cards',
			number: '6500000000000002',
			name: 'Dispute Card',
			expiration_year: 2020,
			expiration_month: 11
		}).save().then(function(card) {
			_this.CARD_ID = card.get('id');
			_this.CARD_ROUTE = _this.MARKETPLACE_ROUTE +
				'/cards/' + _this.CARD_ID;
			return card;
		});
	},

	_createBankAccount: function() {
		var _this = this;
		return Balanced.BankAccount.create({
			uri: '/customers/' + _this.CUSTOMER_ID + '/bank_accounts',
			name: 'Test Account',
			account_number: '1234',
			routing_number: '122242607',
			type: 'checking'
		}).save().then(function(bankAccount) {
			_this.BANK_ACCOUNT_ID = bankAccount.get('id');
			_this.BANK_ACCOUNT_ROUTE = _this.MARKETPLACE_ROUTE +
				'/bank_accounts/' + _this.BANK_ACCOUNT_ID;
			return bankAccount;
		});
	},

	_createReversal: function() {
		var _this = this;

		return Balanced.Reversal.create({
			uri: '/credits/' + _this.CREDIT_ID + '/reversals',
			credit_uri: '/credits/' + _this.CREDIT_ID,
			amount: 10000
		}).save().then(function(reversal) {
			_this.REVERSAL_ID = reversal.get('id');
			_this.REVERSAL_ROUTE = _this.MARKETPLACE_ROUTE +
				'/reversals/' + _this.REVERSAL_ID;
			return reversal;
		});
	},

	_createDebit: function() {
		var _this = this;
		return Balanced.Debit.create({
			uri: '/customers/' + _this.CUSTOMER_ID + '/debits',
			appears_on_statement_as: 'Pixie Dust',
			amount: 10000,
			description: 'Cocaine'
		}).save().then(function(debit) {
			_this.DEBIT_ID = debit.get('id');
			_this.DEBIT_ROUTE = _this.MARKETPLACE_ROUTE +
				'/debits/' + _this.DEBIT_ID;
			return debit;
		});
	},

	_createCredit: function() {
		var _this = this;
		return Balanced.Credit.create({
			uri: '/bank_accounts/' + _this.BANK_ACCOUNT_ID + '/credits',
			amount: 10000
		}).save().then(function(credit) {
			_this.CREDIT_ID = credit.get('id');
			_this.CREDIT_ROUTE = _this.MARKETPLACE_ROUTE +
				'/credits/' + _this.CREDIT_ID;
			return credit;
		});
	},

	_createCustomer: function() {
		var _this = this;
		return Balanced.Customer.create({
			uri: this.marketplace.get('customers_uri'),
			address: {}
		}).save().then(function(customer) {
			return customer;
		});
	},

	_createDispute: function() {
		var _this = this;

		return this._createDisputeCard().then(function() {
			return _this._createDebit().then(function() {
				return Balanced.Dispute.findAll().then(function(disputes) {
					if (!disputes.get('content').length) {
						return setTimeout(_.bind(Testing.createDispute, Testing), 1000);
					}

					var evt = disputes.objectAt(0);
					_this.DISPUTE = evt;
					_this.DISPUTE_ID = evt.get('id');
					_this.DISPUTE_ROUTE = _this.MARKETPLACE_ROUTE +
						'/disputes/' + _this.DISPUTE_ID;

					_this.start();
				});
			});
		});
	},

	createCard: function() {
		var _this = this;
		Ember.run(function() {
			_this._createCard();
		});
	},

	createBankAccount: function() {
		var _this = this;
		Ember.run(function() {
			_this._createBankAccount();
		});
	},

	createReversal: function() {
		this.createCredit();

		var _this = this;
		Ember.run(function() {
			_this._createReversal();
		});
	},

	createCredit: function() {
		var _this = this;
		Ember.run(function() {
			_this._createCard().then(function() {
				return _this._createDebit();
			}).then(function() {
				return _this._createBankAccount();
			}).then(function() {
				_this._createCredit();
			});
		});
	},

	createDebit: function() {
		var _this = this;

		return Ember.run(function() {
			return _this._createCard().then(function() {
				return _this._createDebit();
			});
		});
	},

	createCustomer: function() {
		var _this = this;

		return Ember.run(function() {
			return _this._createCustomer();
		});
	},

	setupEvent: function() {
		var _this = this;
		// Call stop to stop executing the tests before
		// a dispute is created
		this.stop();

		return Ember.run(function() {
			Balanced.Event.findAll().then(function(events) {
				if (!events.get('content').length) {
					return setTimeout(_.bind(Testing.setupEvent, Testing), 1000);
				}

				var evt = events.objectAt(0);
				_this.EVENT_ID = evt.get('id');
				_this.EVENT_ROUTE = _this.MARKETPLACE_ROUTE +
					'/events/' + _this.EVENT_ID;

				_this.start();
			});
		});
	},

	createDispute: function() {
		var _this = this;
		// Call stop to stop executing the tests before
		// a dispute is created
		this.stop();

		// This automatically calls start();
		return Ember.run(function() {
			return _this._createDispute();
		});
	},

	createDebits: function(number) {
		var _this = this;
		number = number || 4;
		Ember.run(function() {
			var i = number;
			while (i > 0) {
				_this._createDebit();
				i--;
			}
		});
	}
};
