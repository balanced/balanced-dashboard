Balanced.MarketplaceBankAccountFactory = Balanced.BaseFactory.extend({
	validations: {
		name: {
			presence: true
		},
		account_number: {
			presence: true
		},
		routing_number: {
			presence: true,
			length: 9,
			matches: {
				validator: function(object, attribute, value) {
					if (window.balanced !== undefined && !balanced.bankAccount.validateRoutingNumber(value)) {
						object.get('validationErrors').add(attribute, 'invalid', null, 'Invalid routing number');
					}
				}
			}
		},
		account_type: {
			presence: true,
			matches: {
				validator: function(object, attribute, value) {
					if (["checking", "savings"].indexOf(value) < 0) {
						object.get('validationErrors').add(attribute, 'invalid', null, 'Invalid bank acount type');
					}
				}
			}
		},
	},

	getPostAttributes: function() {
		return this.getProperties(
			"name",
			"account_type",
			"routing_number",
			"account_number"
		);
	},

	handleResponse: function(response) {
		return response;
	},

	isComplete: false,
	save: function() {
		var self = this;
		var deferred = Ember.RSVP.defer();
		this.get("validationErrors").clear();
		this.validate();

		if (this.get("isValid")) {
			balanced.bankAccount
				.create(this.getPostAttributes(), function(response) {
					if (response.errors) {
						self.setValidationErrorsFromServer(response.errors);
						deferred.reject();
					} else {
						self.set("isComplete", true);
						deferred.resolve(response.bank_accounts[0].href);
					}
				});
		} else {
			deferred.reject();
		}
		return deferred.promise;
	}

});
