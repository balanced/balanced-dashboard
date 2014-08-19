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
		return response.bank_accounts[0].href;
	},

	_save: function() {
		var attributes = this.getPostAttributes();

		var deferred = Ember.RSVP.defer();
		balanced.bankAccount.create(attributes, function(response) {
			if (response.errors) {
				deferred.reject(response);
			} else {
				deferred.resolve(response);
			}
		});
		return deferred.promise;
	},
});
