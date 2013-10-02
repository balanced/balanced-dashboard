require('app/models/card');

Balanced.Card = Balanced.FundingInstrument.extend(Ember.Validations, {
	validations: {
		card_number: {
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
		return 'Card';
	}.property(),

	route_name: function() {
		return 'cards';
	}.property(),

	is_bank_account: false,

	appears_on_statement_max_length: function() {
		return Balanced.MAXLENGTH.APPEARS_ON_STATEMENT_CARD;
	}.property(),

	description: function() {
		return '%@ (%@)'.fmt(
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

	debits_uri: function() {
		return this.get('customer.debits_uri');
	}.property('customer.debits_uri'),

	human_readable_expiration: function() {
		return this.get('expiration_month') + '/' + this.get('expiration_year');
	}.property('expiration_month', 'expiration_year'),

	tokenizeAndCreate: function(customerId) {
		var self = this;
		var promise = this.resolveOn('didCreate');

		this.set('isSaving', true);
		var cardData = {
			number: this.get('number'),
			expiration_month: this.get('expiration_month'),
			expiration_year: this.get('expiration_year'),
			security_code: this.get('security_code'),
			name: this.get('name'),
			postal_code: this.get('postal_code')
		};

		// Tokenize the card using the balanced.js library
		balanced.card.create(cardData, function(response) {
			switch (response.status_code) {
				case 201:
					// Now that it's been tokenized, we just need to associate it with the customer's account
					Balanced.Card.find(response.cards[0].href).then(function(card) {
						card.set('links.customer', customerId);

						card.save().then(function() {
							self.set('isLoaded', true);
							self.set('isNew', false);
							self.set('isSaving', false);
							self.trigger('didCreate');
						}, function() {
							self.set('displayErrorDescription', true);
							self.set('errorDescription', 'Sorry, there was an error associating this card.');
							self.set('isSaving', false);
							promise.reject();
						})
					});
					break;
				case 400:
					self.set('validationErrors', {});
					if (response.error.expiration) {
						self.set('validationErrors.expiration_month', 'invalid');
					}
					_.each(response.error, function(value, key) {
						self.set('validationErrors.' + key, 'invalid');
					});
					self.set('isSaving', false);
					promise.reject();
					break;
				default:
					self.set('displayErrorDescription', true);
					var errorSuffix = (response.error && response.error.description) ? (': ' + response.error.description) : '.';
					self.set('errorDescription', 'Sorry, there was an error tokenizing this card' + errorSuffix);
					self.set('isSaving', false);
					promise.reject();
					break;
			}
		});

		return promise;
	}
});

Balanced.TypeMappings.addTypeMapping('card', 'Balanced.Card');
