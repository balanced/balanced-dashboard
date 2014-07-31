var Testing = {
	FIXTURE_MARKETPLACE_ROUTE: '/marketplaces/FIXTURED-MP4cOZZqeAelhxXQzljLLtgl',
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

	// isStopped: false,
	isStopped: function() {
		return window.QUnit.config.semaphore !== 0;
	},

	stop: function() {
		if (!this.isStopped()) {
			stop();
		}
	},

	start: function() {
		if (this.isStopped()) {
			start();
		}
	},

	pause: function(number, fn) {
		if (!number) {
			number = 1000;
		}

		this.stop();
		_.delay(_.bind(this.start, this), number);

		if (fn) {
			_.delay(fn, number);
		}
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
		var self = this;
		Ember.run(function() {
			var userId = self.FIXTURE_USER_ROUTE = '/users/USeb4a5d6ca6ed11e2bea6026ba7db2987';
			Balanced.Auth.setAuthProperties(
				true,
				Balanced.User.find(userId),
				userId,
				userId,
				false);

			self.FIXTURE_USER_EMAIL = Balanced.Auth.user.email_address;
		});
	},

	useFixtureData: function() {
		this.setupFixtures();
		this.fixtureLogin();
	},

	logout: function() {
		Ember.run(function() {
			Balanced.Auth.setAuthProperties(false, null, null, null, false);
		});
	},

	// build up test fixtures
	setupMarketplace: function() {
		var self = this;
		Ember.run(function() {
			return Balanced.NET.loadCSRFTokenIfNotLoaded()
				.then(function() {
					return Balanced.Auth.createNewGuestUser();
				})
				.then(function(apiKey) {
					self.GUEST_USER_API_KEY = apiKey;
					return Balanced.Marketplace.create().save();
				})
				.then(function(marketplace) {
					Balanced.Auth.setupGuestUserMarketplace(marketplace);
					self.setupCreatedMarketplace(marketplace);
				});
		});
	},

	setupCreatedMarketplace: function(marketplace) {
		this.marketplace = marketplace;

		this.MARKETPLACE_ID = marketplace.get('id');
		this.CUSTOMER_ID = marketplace.get('owner_customer_uri').split('/').pop();
		this.MARKETPLACES_ROUTE = '/marketplaces';
		this.MARKETPLACE_ROUTE = '/marketplaces/' + this.MARKETPLACE_ID;
		this.ACTIVITY_ROUTE = '/marketplaces/' + this.MARKETPLACE_ID + '/activity/transactions';
		this.ADD_CUSTOMER_ROUTE = '/marketplaces/' + this.MARKETPLACE_ID + '/add_customer';
		this.CUSTOMER_ROUTE = '/marketplaces/' + this.MARKETPLACE_ID + '/customers/' + this.CUSTOMER_ID;
		this.LOGS_ROUTE = '/marketplaces/' + this.MARKETPLACE_ID + '/logs';
		this.SETTINGS_ROUTE = '/marketplaces/' + this.MARKETPLACE_ID + '/settings';
		this.INITIAL_DEPOSIT_ROUTE = '/marketplaces/' + this.MARKETPLACE_ID + '/initial_deposit';
	},

	restoreMethods: function() {
		_.each(arguments, function(method) {
			if (method.restore) {
				method.restore();
			}
		});
	},

	_createCard: function(type) {
		var self = this;
		var number = '4111111111111111';
		if (type === 'debit') {
			number = '4000056655665556';
		}

		return Balanced.Card.create({
			uri: '/customers/' + this.CUSTOMER_ID + '/cards',
			number: number,
			expiration_year: 2020,
			expiration_month: 11
		}).save().then(function(card) {
			self.CARD_ID = card.get('id');
			self.CARD_ROUTE = self.MARKETPLACE_ROUTE +
				'/cards/' + self.CARD_ID;
			return card;
		});
	},

	_createDisputeCard: function() {
		var self = this;
		return Balanced.Card.create({
			uri: '/customers/' + this.CUSTOMER_ID + '/cards',
			number: '6500000000000002',
			name: 'Dispute Card',
			expiration_year: 2020,
			expiration_month: 11
		}).save().then(function(card) {
			self.CARD_ID = card.get('id');
			self.CARD_ROUTE = self.MARKETPLACE_ROUTE +
				'/cards/' + self.CARD_ID;
			return card;
		});
	},

	_createBankAccount: function() {
		var self = this;
		return Balanced.BankAccount.create({
			uri: '/customers/' + self.CUSTOMER_ID + '/bank_accounts',
			name: 'Test Account',
			account_number: '1234',
			routing_number: '122242607',
			type: 'checking'
		}).save().then(function(bankAccount) {
			self.BANK_ACCOUNT_ID = bankAccount.get('id');
			self.BANK_ACCOUNT_ROUTE = self.MARKETPLACE_ROUTE +
				'/bank_accounts/' + self.BANK_ACCOUNT_ID;
			return bankAccount;
		});
	},

	_createReversal: function() {
		var self = this;

		return Balanced.Reversal.create({
			uri: '/credits/' + self.CREDIT_ID + '/reversals',
			credit_uri: '/credits/' + self.CREDIT_ID,
			amount: 10000
		}).save().then(function(reversal) {
			self.REVERSAL_ID = reversal.get('id');
			self.REVERSAL_ROUTE = self.MARKETPLACE_ROUTE +
				'/reversals/' + self.REVERSAL_ID;
			return reversal;
		});
	},

	_createDebit: function() {
		var self = this;
		return Balanced.Debit.create({
			uri: '/customers/' + self.CUSTOMER_ID + '/debits',
			appears_on_statement_as: 'Pixie Dust',
			amount: 10000,
			description: 'Cocaine'
		}).save().then(function(debit) {
			self.DEBIT_ID = debit.get('id');
			self.DEBIT_ROUTE = self.MARKETPLACE_ROUTE +
				'/debits/' + self.DEBIT_ID;
			return debit;
		});
	},

	_createCredit: function() {
		var self = this;
		return Balanced.Credit.create({
			uri: '/bank_accounts/' + self.BANK_ACCOUNT_ID + '/credits',
			amount: 10000
		}).save().then(function(credit) {
			self.CREDIT_ID = credit.get('id');
			self.CREDIT_ROUTE = self.MARKETPLACE_ROUTE +
				'/credits/' + self.CREDIT_ID;
			return credit;
		});
	},

	waitForState: function(intervalTimeout, errorTimeout, callback) {
		var startDate = new Date();
		return new Ember.RSVP.Promise(function(resolve, reject) {
			var execute = function() {
				callback(resolve, function() {
					var elapsedTime = new Date() - startDate;
					if (elapsedTime < errorTimeout) {
						setTimeout(execute, intervalTimeout);
					} else {
						reject();
					}
				});
			};
			execute();
		});
	},

	assertEnoughDisputesAvailable: function(num) {
		return this.waitForState(1000, 10000, function(done, error) {
			Balanced.Dispute.findAll().then(function(disputes) {
				if (disputes.get("length") < num) {
					error();
				} else {
					done(disputes.get("length"));
				}
			});
		});
	},

	_createDispute: function(howMany) {
		var self = this;
		var createDisputesPromises = _.times(howMany, function() {
			return self._createDisputeCard().then(function() {
				return self._createDebit();
			});
		});

		Ember.RSVP.all(createDisputesPromises).then(function(results) {
			var timeout = 10000;
			self.assertEnoughDisputesAvailable(howMany).then(function(disputes) {
				var evt = disputes.objectAt(0);
				self.DISPUTE = evt;
				self.DISPUTE_ID = evt.get('id');
				self.DISPUTE_ROUTE = self.MARKETPLACE_ROUTE +
					'/disputes/' + self.DISPUTE_ID;
				self.start();
			}, function() {
				Ember.Logger.error("Couldn't find disputes after " + timeout + "ms");
				self.start();
			});
		});
	},

	createHold: function() {
		var self = this;
		var cardAttributes = {
			number: '4111111111111111',
			expiration_year: 2020,
			expiration_month: 11
		};

		return Balanced.Card.create(cardAttributes)
			.save()
			.then(function(card) {
				var hold = Balanced.Hold.create({
					uri: card.get("card_holds_uri"),
					source_uri: card.get("uri"),
					appears_on_statement_as: 'Test Hold',
					amount: 10000
				});
				return hold.save();
			});
	},

	createCard: function() {
		var self = this;
		Ember.run(function() {
			self._createCard();
		});
	},

	createDebitCard: function() {
		var self = this;
		Ember.run(function() {
			self._createCard('debit');
		});
	},

	createCreditCard: function() {
		var self = this;
		Ember.run(function() {
			self._createCard('credit');
		});
	},

	createBankAccount: function() {
		var self = this;
		Ember.run(function() {
			self._createBankAccount();
		});
	},

	createReversal: function() {
		this.createCredit();

		var self = this;
		Ember.run(function() {
			self._createReversal();
		});
	},

	createCredit: function() {
		var self = this;
		Ember.run(function() {
			self._createCard().then(function() {
				return self._createDebit();
			}).then(function() {
				return self._createBankAccount();
			}).then(function() {
				self._createCredit();
			});
		});
	},

	createRefund: function() {
		this.createDebit();

		var _this = this;
		Ember.run(function() {
			_this._createRefund();
		});
	},

	createDebit: function() {
		var self = this;

		return Ember.run(function() {
			return self._createCard().then(function() {
				return self._createDebit();
			});
		});
	},

	createCustomer: function() {
		var self = this;

		return Balanced.Customer.create({
			uri: this.marketplace.get('customers_uri'),
			address: {}
		}).save();
	},

	setupEvent: function(howMany) {
		var self = this;
		howMany = howMany || 4;

		// Call stop to stop executing the tests before
		// a event is created
		this.stop();

		return Ember.run(function() {
			Balanced.Event.findAll().then(function(events) {
				// Wait for atleast 2 events
				if (events.get('length') < howMany) {
					return setTimeout(_.bind(Testing.setupEvent, Testing, howMany), 1000);
				}

				var evt = events.objectAt(0);
				self.EVENT_ID = evt.get('id');
				self.EVENT_ROUTE = self.MARKETPLACE_ROUTE +
					'/events/' + self.EVENT_ID;

				self.start();
			});
		});
	},

	waitForResults: function(controller, howMany, type) {
		var self = this;

		Ember.run(function() {
			controller.get('results').then(function(results) {
				// Wait for atleast 4 results
				if (results.get('length') < howMany && results.get('total_' + (type === 'search' ? 'transaction' : type) + 's') < howMany) {
					controller.send('reload');
					return setTimeout(_.bind(self.waitForResults, self, controller, howMany, type), 1000);
				}

				self.start();
			});
		});
	},

	setupResults: function(route, controllerKey, defaultType, howMany, type, setupControllerCall) {
		howMany = howMany || 1;
		type = type || defaultType;

		// Call stop to stop executing the tests before
		// a log is created
		this.stop();

		// Visit the marketplace route to initialize everything
		Ember.run(function() {
			visit(route);
		});

		var controller = Balanced.__container__.lookup('controller:' + controllerKey);

		Ember.run(function() {
			controller.set('type', type);

			if (_.isFunction(setupControllerCall)) {
				setupControllerCall(controller, howMany, type);
			}
		});

		this.waitForResults(controller, howMany, type);
	},

	setupActivity: function(howMany, type) {
		this.setupResults(this.ACTIVITY_ROUTE, 'marketplace', 'transaction', howMany, type);
	},

	createDisputes: function(number) {
		var self = this;
		var initialNumberDisputes = number || 4;

		this.stop();
		Ember.run(function() {
			self._createDispute(initialNumberDisputes);
		});
	},

	createDebits: function(number) {
		var self = this;
		number = number || 4;

		var promises = _.times(number, function() {
			return self._createDebit();
		});
		self.stop();
		Ember.RSVP.all(promises).then(function() {
			self.start();
		});
	}
};
