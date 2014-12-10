import Computed from "balanced-dashboard/utils/computed";
import Constants from "balanced-dashboard/utils/constants";
import FundingInstrument from "./funding-instrument";
import Utils from "balanced-dashboard/lib/utils";

var Card = FundingInstrument.extend(Ember.Validations, {
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
		cvv: {
			presence: true,
			numericality: true,
			length: {
				minimum: 3,
				maximum: 4
			}
		}
	},

	isCard: true,

	type_name: function() {
		if (this.get('type')) {
			if (this.get('is_prepaid')) {
				return 'Prepaid card';
			} else {
				return this.get('type').capitalize() + ' card';
			}
		} else {
			return 'Card';
		}
	}.property('type', 'is_prepaid'),

	status: function() {
		return this.get('can_debit') ? 'active' : 'removed';
	}.property('can_debit'),

	is_prepaid: function() {
		return this.get('category') === "prepaid";
	}.property('category'),

	route_name: 'cards',
	postal_code: Ember.computed.alias('address.postal_code'),
	appears_on_statement_max_length: Constants.MAXLENGTH.APPEARS_ON_STATEMENT_CARD,
	expected_credit_days_offset: Constants.EXPECTED_DAYS_OFFSET.CREDIT_DEBIT_CARD,
	page_title: Ember.computed.readOnly('displayName'),

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
			Utils.toTitleCase(this.get('brand'))
		);
	}.property('last_four', 'brand'),

	displayName: function() {
		return '%@ (%@ %@)'.fmt(
			this.get('name'),
			this.get('last_four'),
			Utils.toTitleCase(this.get('brand'))
		);
	}.property('name', 'last_four', 'brand'),

	human_readable_expiration: Computed.fmt('expiration_month', 'expiration_year', '%@/%@'),

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
			cvv: this.get('cvv'),
			name: this.get('name'),
			address: this.get('address') || {}
		};

		if (customerId) {
			cardData.customer = customerId;
		}

		// Tokenize the card using the balanced.js library
		balanced.card.create(cardData, function(response) {
			if (response.errors) {
				var validationErrors = Utils.extractValidationErrorHash(response);
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

				promise.reject(validationErrors);
			} else {
				Card.find(response.cards[0].href)

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

export default Card;
