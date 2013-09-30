Balanced.ProductionAccessRequest = Balanced.Model.extend(Ember.Validations, {
	address: Ember.computed(function() {
		return Balanced.Model.create();
	}),
	banking: Ember.computed(function() {
		return Balanced.Model.create();
	}),
	marketplace: Ember.computed(function() {
		return Balanced.Model.create();
	}),
	validations: {
		email_address: {
			presence: {
				validator: function(object, attribute, value) {
					if (Balanced.Auth.get('isGuest') && !value) {
						object.get('validationErrors').add(attribute, 'blank');
					}
				}
			}
		},
		password: {
			presence: {
				validator: function(object, attribute, value) {
					if (Balanced.Auth.get('isGuest') && !value) {
						object.get('validationErrors').add(attribute, 'blank');
					}
				}
			}
		},
		name: {
			presence: true
		},
		ssn_last4: {
			presence: true,
			length: 4,
			numericality: true
		},
		phone_number: {
			presence: true
		},
		'address.street_address': {
			presence: true
		},
		'address.postal_code': {
			presence: true,
			length: {
				minimum: 5,
				maximum: 10
			},
			format: /^\d{5}([\-]?\d{4})?$/
		},
		'banking.account_name': {
			presence: true
		},
		'banking.account_number': {
			presence: true
		},
		'banking.routing_number': {
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
		'marketplace.name': {
			presence: true
		},
		'marketplace.support_email_address': {
			presence: true
		},
		'marketplace.support_phone_number': {
			presence: true
		},
		'marketplace.domain_url': {
			presence: true
		}
	}
});
