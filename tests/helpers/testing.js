import Constants from "balanced-dashboard/utils/constants";
import setupMarketplace from "./setup-marketplace";
import setupCreatedMarketplace from "./setup-created-marketplace";
import Models from "./models";

var instantiateModel = function(type, properties) {
	return BalancedApp.__container__.lookupFactory("model:" + type).create(properties);
};

var Testing = {
	FIXTURE_MARKETPLACE_ROUTE: '/marketplaces/FIXTURED-MP4cOZZqeAelhxXQzljLLtgl',
	FIXTURE_USER_EMAIL: "foo@bar.com",
	FIXTURE_USER_ROUTE: "/users/USeb4a5d6ca6ed11e2bea6026ba7db2987",
	marketplace: null,

	// constant ids
	MARKETPLACE_ID: null,
	CARD_ID: null,
	BANK_ACCOUNT_ID: null,
	CREDIT_ID: null,
	CUSTOMER_ID: null,
	DEBIT_ID: null,
	REVERSAL_ID: null,
	ORDER_ID: null,

	// constant routes
	MARKETPLACES_ROUTE: '/marketplaces',
	TRANSACTIONS_ROUTE: null,
	ADD_CUSTOMER_ROUTE: null,
	BANK_ACCOUNT_ROUTE: null,
	CARD_ROUTE: null,
	CREDIT_ROUTE: null,
	CUSTOMER_ROUTE: null,
	DEBIT_ROUTE: null,
	REVERSAL_ROUTE: null,
	ORDER_ROUTE: null,

	// constant models
	CREDIT_1: null,
	CREDIT_2: null,
	DEBIT: null,
	REFUND: null,
	REVERSAL: null,
	CUSTOMER: null,

	selectMarketplaceByName: function(name) {
		name = name || 'Test Marketplace';
		$('#marketplaces ul a:contains("' + name + '")').click();
	},

	runSearch: function(query) {
		Ember.run(function() {
			$('.search-field-container').click();
		});

		Ember.run(function() {
			$('#q').val(query).trigger('keyup');
			// Press enter to run the search immediately
			$("#q").trigger(jQuery.Event("keyup", {
				keyCode: Constants.KEYS.ENTER
			}));
		});
	},

	visitSettingsPage: function() {
		var SETTINGS_ROUTE = Testing.FIXTURE_MARKETPLACE_ROUTE + '/settings';
		var DISPUTES_ROUTE = Testing.FIXTURE_MARKETPLACE_ROUTE + '/disputes';
		var disputesController = BalancedApp.__container__.lookup('controller:marketplace/disputes');

		return visit(this.DISPUTES_ROUTE)
			.then(function() {
				var marketplace = BalancedApp.__container__.lookup("controller:marketplace").get("model");
				Ember.run(function() {
					var customer = instantiateModel("customer");
					marketplace.set("owner_customer", customer);
				});
			})
			.then(function() {
				return visit(SETTINGS_ROUTE);
			});
	},

	logout: function() {
		var Auth = BalancedApp.__container__.lookup("auth:main");
		Ember.run(function() {
			Auth.setAuthProperties(false, null, null, null, false);
		});
	},

	setupMarketplace: function() {
		var self = this;

		andThen(function() {
			setupMarketplace(window.BalancedApp)
				.then(function(mp) {
					var routes = setupCreatedMarketplace(mp);
					_.extend(self, routes);
				});
		});
	},

	restoreMethods: function() {
		_.each(arguments, function(method) {
			if (method && method.restore) {
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

		return instantiateModel("card", {
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
		return instantiateModel("card", {
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
		return instantiateModel("bank-account", {
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

		return instantiateModel("reversal", {
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
		return instantiateModel("debit", {
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
		return instantiateModel("credit", {
			uri: '/bank_accounts/' + self.BANK_ACCOUNT_ID + '/credits',
			amount: 10000
		}).save().then(function(credit) {
			self.CREDIT_ID = credit.get('id');
			self.CREDIT_ROUTE = self.MARKETPLACE_ROUTE +
				'/credits/' + self.CREDIT_ID;
			return credit;
		});
	},

	createHold: function() {
		var self = this;
		var cardAttributes = {
			number: '4111111111111111',
			expiration_year: 2020,
			expiration_month: 11
		};

		instantiateModel("card", cardAttributes)
			.save()
			.then(function(card) {
				var hold = instantiateModel("hold", {
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
		andThen(function() {
			self._createCard();
		});
	},

	createDebitCard: function() {
		var self = this;
		andThen(function() {
			self._createCard('debit');
		});
	},

	createCreditCard: function() {
		var self = this;
		andThen(function() {
			self._createCard('credit');
		});
	},

	createBankAccount: function() {
		var self = this;
		andThen(function() {
			self._createBankAccount();
		});
	},

	createReversal: function() {
		this.createCredit();

		var self = this;
		andThen(function() {
			self._createReversal();
		});
	},

	createCredit: function() {
		var self = this;
		andThen(function() {
			self._createCard();
		});
		andThen(function() {
			self._createDebit();
		});
		andThen(function() {
			self._createBankAccount();
		});
		andThen(function() {
			self._createCredit();
		});
	},

	createRefund: function() {
		var self = this;
		andThen(function() {
			self._createRefund();
		});
	},

	createDebit: function() {
		var self = this;

		andThen(function() {
			self._createCard();
		});
		andThen(function() {
			self._createDebit();
		});
	},

	createDebits: function() {
		var self = this;

		_.times(4, function() {
			return self.createDebit();
		});
	},

	createOrder: function() {
		var self = this;
		var orderAttributes = {
			uri: '/customers/' + this.CUSTOMER_ID + '/orders',
			description: '#123'
		};

		instantiateModel("order", orderAttributes)
			.save()
			.then(function(order) {
				self.ORDER_ID = order.get('id');
				self.ORDER_ROUTE = '/marketplaces/' + self.MARKETPLACE_ID +
					'/orders/' + self.ORDER_ID;

				return instantiateModel("debit", {
					uri: '/customers/' + self.CUSTOMER_ID + '/debits',
					appears_on_statement_as: 'Pixie Dust',
					amount: 10000,
					description: 'Cocaine',
					links: {
						order: '/orders/' + self.ORDER_ID
					}
				}).save();
			}).then(function(debit) {
				self.DEBIT = debit;
				return self._createBankAccount();
			}).then(function(bankAccount) {
				self.BANK_ACCOUNT_ID = bankAccount.get('id');

				return instantiateModel("credit", {
					uri: '/bank_accounts/' + self.BANK_ACCOUNT_ID + '/credits',
					amount: 1000,
					links: {
						order: '/orders/' + self.ORDER_ID
					}
				}).save();
			}).then(function(credit) {
				self.CREDIT_1 = credit;

				return instantiateModel("bank-account", {
					uri: '/customers/' + self.CUSTOMER_ID + '/bank_accounts',
					name: 'Test Account 2',
					account_number: '12345',
					routing_number: '122242607',
					type: 'checking'
				}).save();
			}).then(function(bankAccount) {
				self.BANK_ACCOUNT_ID = bankAccount.get('id');

				return instantiateModel("credit", {
					uri: '/bank_accounts/' + self.BANK_ACCOUNT_ID + '/credits',
					amount: 1000,
					links: {
						order: '/orders/' + self.ORDER_ID
					}
				}).save();
			}).then(function(credit) {
				self.CREDIT_2 = credit;

				return instantiateModel("refund", {
					uri: '/debits/' + self.DEBIT.get('id') + '/refunds',
					amount: 200,
					description: 'Cocaine refund',
					links: {
						order: '/orders/' + self.ORDER_ID
					}
				}).save();
			}).then(function(refund) {
				self.REFUND = refund;

				return instantiateModel("reversal", {
					uri: '/credits/' + self.CREDIT_1.get('id') + '/reversals',
					amount: 100,
					links: {
						order: '/orders/' + self.ORDER_ID
					}
				}).save();
			}).then(function(reversal) {
				self.REVERSAL = reversal;

				return BalancedApp.__container__.lookupFactory("model:customer")
					.find('/customers/' + self.CUSTOMER_ID);
			}).then(function(customer) {
				self.CUSTOMER = customer;
			});
	},

	createCustomer: function() {
		var self = this;

		andThen(function() {
			instantiateModel("customer", {
				uri: self.marketplace.get('customers_uri'),
				address: {}
			}).save();
		});
	},
};

export default Testing;
