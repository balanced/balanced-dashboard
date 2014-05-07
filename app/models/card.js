require('app/models/funding_instrument');

Balanced.Card = Balanced.FundingInstrument.extend(Ember.Validations, {
	uri: '/cards',

	validations: {
		number: {
			presence: true,
			format: {
				validator: function(object, attribute, value) {
					if (!balanced.card.isCardNumberValid(value)) {
						object.get('validationErrors').add(attribute, 'blank', null, 'is not valid');
					}
				}
			}
		},
		expiration_month: {
			presence: true
		},
		expiration_year: {
			presence: true
		},
		security_code: {
			presence: true,
			numericality: true,
			length: {
				minimum: 3,
				maximum: 4
			}
		}
	},

	type_name: function() {
		return this.get('card_type') + ' card';
	}.property('card_type'),

	card_type: function() {
		if (this.get('is_debit')) {
			return 'Debit';
		} else {
			return 'Credit';
		}
	}.property('is_debit'),

	is_debit: function() {
		if (!this.get('can_credit')) {
			return false;
		}
		return this.get('can_credit');
	}.property('can_credit'),

	route_name: 'cards',
	postal_code: Ember.computed.alias('address.postal_code'),
	is_bank_account: false,
	appears_on_statement_max_length: Balanced.MAXLENGTH.APPEARS_ON_STATEMENT_CARD,

	last_four: function() {
		var accountNumber = this.get('number');
		if (!accountNumber || accountNumber.length < 5) {
			return accountNumber;
		} else {
			return accountNumber.substr(accountNumber.length - 4, 4);
		}
	}.property('account_number'),

	description: function() {
		return '%@ %@'.fmt(
			this.get('last_four'),
			Balanced.Utils.toTitleCase(this.get('brand'))
		);
	}.property('last_four', 'brand'),

	displayName: function() {
		return '%@ (%@ %@)'.fmt(
			this.get('name'),
			this.get('last_four'),
			Balanced.Utils.toTitleCase(this.get('brand'))
		);
	}.property('name', 'last_four', 'brand'),

	human_readable_expiration: Balanced.computed.fmt('expiration_month', 'expiration_year', '%@/%@'),

	tokenizeAndCreate: function(customerId) {
		var self = this;
		var promise = this.resolveOn('didCreate');

		function errorCreatingCard(err) {
			Ember.run.next(function() {
				self.setProperties({
					displayErrorDescription: true,
					isSaving: false,
					errorDescription: 'There was an error processing your card. ' + (Ember.get(err, 'errorDescription') || ''),
					validationErrors: Ember.get(err, 'validationErrors') || {}
				});
			});

			promise.reject();
		}

		this.set('isSaving', true);
		var cardData = {
			number: this.get('number'),
			expiration_month: this.get('expiration_month'),
			expiration_year: this.get('expiration_year'),
			cvv: this.get('security_code'),
			name: this.get('name'),
			address: this.get('address') || {}
		};

		if (customerId) {
			cardData.customer = customerId;
		}

		// Tokenize the card using the balanced.js library
		balanced.card.create(cardData, function(response) {
			if (response.errors) {
				var validationErrors = Balanced.Utils.extractValidationErrorHash(response);
				self.setProperties({
					validationErrors: validationErrors,
					isSaving: false
				});

				if (!validationErrors) {
					self.set('displayErrorDescription', true);
					var errorSuffix = (response.errors && response.errors.length > 0 && response.errors[0].description) ? (': ' + response.errors[0].description) : '.';
					self.setProperties({
						displayErrorDescription: true,
						errorDescription: 'Sorry, there was an error tokenizing this card' + errorSuffix
					});
				}

				promise.reject();
			} else {
				Balanced.Card.find(response.cards[0].href)

				// Now that it's been tokenized, we just need to associate it with the customer's account
				.then(function(card) {
					card.set('links.customer', customerId);

					card.save().then(function() {
						self.setProperties({
							isSaving: false,
							isNew: false,
							isLoaded: true
						});

						self.trigger('didCreate', card);
					}, errorCreatingCard);
				}, errorCreatingCard);
			}
		});

		return promise;
	}
});

Balanced.TypeMappings.addTypeMapping('card', 'Balanced.Card');
