import BaseFactory from "./base";
import AuthConnection from "balanced-dashboard/lib/connections/auth-connection";

var UserAccountFactory = BaseFactory.extend({
	validations: {
		email_address: {
			presence: true
		},
		password: {
			presence: true,
			length: {
				minimum: 6
			}
		},
		passwordConfirm: {
			presence: true,
			matches: {
				validator: function(object, attribute, value) {
					var password = object.get('password');
					if (value !== password) {
						object.get('validationErrors').add(attribute, 'invalid');
					}
				}
			}
		}
	},

	_save: function() {
		return this.getConnection().createUser(this.getPostAttributes());
	},

	connection: function() {
		return AuthConnection.create();
	}.property(),

	getConnection: function() {
		return this.get("connection");
	},

	getPostAttributes: function() {
		return this.getProperties(
			"email_address",
			"password",
			"passwordConfirm"
		);
	},

	handleResponse: function(response) {
		return response.uri;
	},

	setValidationErrorsFromServer: function(response) {
		var validationErrors = this.get("validationErrors");
		validationErrors.clear();

		_.each(response, function(errorMessages, property) {
			errorMessages.forEach(function(message) {
				validationErrors.add(property, "serverError", null, message);
			});
		});
	},
});

export default UserAccountFactory;
