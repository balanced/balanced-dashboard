var ExecutionErrorHandler = {
	messagesFromResponse: function(response, defaultMessage) {
		if (response.message) {
			return [response.message];
		} else if (response.description) {
			return [response.description];
		} else if (response.errors) {
			return response.errors.mapBy("description");
		} else if (defaultMessage) {
			return [defaultMessage];
		} else {
			return ["There was an error executing this step"];
		}
	}
};

var LoaderState = Ember.Object.extend({
	isLoading: false,
	isError: false,
	message: "",
	errorMessages: function() {
		return [];
	}.property(),
	execute: function(callback) {
		var self = this;
		this.setProperties({
			isLoading: true,
			isError: false,
			errorMessages: [],
		});
		return new Ember.RSVP.Promise(function(resolve, reject) {
			Ember.RSVP.resolve(callback()).then(function(a) {
				self.setProperties({
					isLoading: false
				});
				resolve(a);
			}, function(response) {
				self.setProperties({
					errorMessages: ExecutionErrorHandler.messagesFromResponse(response),
					isLoading: false,
					isError: true
				});
				reject();
			});
		});
	},
});

Balanced.MarketplaceBankAccountNewController = Balanced.Controller.extend({
	needs: ["marketplace"],
	accountTypes: [{
		value: "checking",
		label: "Checking"
	}, {
		value: "savings",
		label: "Savings"
	}],

	setupLoaderState: function(attributes) {
		var loaderState = LoaderState.create(attributes);
		this.set("loaderState", loaderState);
		return loaderState;
	},

	loadBankAccount: function(href) {
		var self = this;
		var loader = this.setupLoaderState({
			message: "Loading bank account",
			callback: function() {
				self.loadBankAccount(href);
			},
		});

		loader
			.execute(function() {
				return Balanced.BankAccount.find(href);
			})
			.then(function(bankAccount) {
				self.linkOwnerCustomer(bankAccount);
			});
	},

	linkOwnerCustomer: function(bankAccount) {
		var self = this;
		var loader = this.setupLoaderState({
			message: "Linking owner customer",
			callback: function() {
				self.linkOwnerCustomer(bankAccount);
			},
		});
		var customerId = this.get("marketplace.links.owner_customer");

		loader
			.execute(function() {
				bankAccount.set("links.customer", customerId);
				return bankAccount.save();
			})
			.then(function(bankAccount) {
				self.createVerification(bankAccount);
			});
	},

	createVerification: function(bankAccount) {
		var self = this;
		var marketplace = this.get("marketplace");
		var loader = this.setupLoaderState({
			message: "Creating verification",
			callback: function() {
				self.createVerification(bankAccount);
			},
		});
		loader
			.execute(function() {
				var verification = Balanced.Verification.create({
					uri: bankAccount.get("bank_account_verifications_uri")
				});
				return verification.save();
			})
			.then(function() {
				self.transitionToRoute("activity.transactions");
			});
	},

	isBankAccountSaved: Ember.computed.oneWay("model.isComplete"),
	isBankAccountNew: Ember.computed.not("isBankAccountSaved"),
	isSaving: false,

	marketplace: Ember.computed.oneWay("controllers.marketplace"),

	actions: {
		retry: function(callback) {
			callback();
		},
		save: function() {
			var self = this;
			self.set("isSaving", true);

			this.get("model")
				.save()
				.then(function(href) {
					self.loadBankAccount(href);
					self.set("isSaving", false);
				}, function() {
					self.set("isSaving", false);
				});
		}
	}
});
