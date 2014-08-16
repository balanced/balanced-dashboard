Balanced.UserAccountFactory = Balanced.BaseFactory.extend({
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

	getConnection: function() {
		return Balanced.Connections.AuthConnection.create();
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
	handleErrorResponse: function(response) {
		var validationErrors = this.get("validationErrors");
		validationErrors.clear();
		validationErrors.add("", "serverError", null, "There was an error creating your account.");
		this.setValidationErrorsFromServer(response);
	},
});
