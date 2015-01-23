import Debit from "../debit";
import Card from "../card";
import TransactionFactory from "./transaction-factory";
import ValidationHelpers from "balanced-dashboard/utils/validation-helpers";

var EXPIRATION_DATE_FORMAT = /^(\d\d) [\/-] (\d\d\d\d)$/;

var DebitCardTransactionFactory = TransactionFactory.extend({
	getDestinationAttributes: function() {
		var attributes = this.getProperties("name", "number", "cvv", "expiration_month", "expiration_year");
		attributes.address = {
			postal_code: this.get("postal_code")
		};
		return attributes;
	},

	getDebitAttributes: function() {
		return this.getProperties("amount", "appears_on_statement_as", "description");
	},

	validations: {
		dollar_amount: ValidationHelpers.positiveDollarAmount,
		appears_on_statement_as: ValidationHelpers.cardTransactionAppearsOnStatementAs,

		name: ValidationHelpers.cardName,
		number: ValidationHelpers.cardNumber,
		cvv: ValidationHelpers.cardCvv,
		expiration_date: {
			presence: true,
			format: EXPIRATION_DATE_FORMAT,
			expired: {
				validator: function(object, attrName, value) {
					var date = object.getExpirationDate();
					if (date < new Date()) {
						object.get("validationErrors").add(attrName, "expired", null, "is expired");
					}
				}
			}
		}
	},

	getExpirationDate: function() {
		var match = this.getExpirationDateMatch();
		if (match) {
			return moment(match[0], "MM / YYYY").endOf("month").toDate();
		}
	},

	getExpirationDateMatch: function() {
		var expirationDate = this.get("expiration_date");
		if (!Ember.isBlank(expirationDate)) {
			return expirationDate.match(EXPIRATION_DATE_FORMAT);
		}
	},

	expiration_month: function() {
		var match = this.getExpirationDateMatch();
		if (match) {
			return match[1];
		}
	}.property("expiration_date"),

	expiration_year: function() {
		var match = this.getExpirationDateMatch();
		if (match) {
			return match[2];
		}
	}.property("expiration_date"),

	saveCard: function() {
		var attributes = this.getDestinationAttributes();
		var deferred = Ember.RSVP.defer();

		function resolve(r) {
			deferred.resolve(r);
		}
		function reject(r) {
			deferred.reject(r);
		}
		window.balanced.card.create(attributes, function(response) {
			if (response.status_code === 201) {
				Card.findCreatedCard(response.cards[0].href).then(resolve, reject);
			}
			else {
				reject(response);
			}
		});
		return deferred.promise;
	},

	save: function() {
		var deferred = Ember.RSVP.defer();

		var baseDebitAttributes = this.getDebitAttributes();
		var self = this;
		this.validate();

		var getErrorMessage = function(error) {
			return Ember.isBlank(error.additional) ?
				error.description :
				error.additional;
		};

		if (this.get("isValid")) {
			this.saveCard()
				.then(function(card) {
					var debitAttributes = _.extend({}, baseDebitAttributes, {
						uri: card.get('debits_uri'),
						source_uri: card.get('uri')
					});
					return Debit.create(debitAttributes).save();
				})
				.then(function(model) {
					deferred.resolve(model);
				}, function(response) {
					response.errors.forEach(function(error) {
						if (Ember.isBlank(error.extras)) {
							self.get("validationErrors").add(undefined, "server", null, getErrorMessage(error));
						}
						else {
							_.each(error.extras, function(value, key) {
								self.get("validationErrors").add(key, "server", null, value);
							});
						}
					});
					deferred.reject(self);
				});
		} else {
			deferred.reject();
		}

		return deferred.promise;
	}
});

export default DebitCardTransactionFactory;
