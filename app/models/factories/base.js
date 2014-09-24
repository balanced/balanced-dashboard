import Ember from "ember";

var BaseFactory = Ember.Object.extend(Ember.Validations, {
	setValidationErrorsFromServer: function(response) {
		var self = this;
		var errorsList = response.errors || [];
		var validationErrors = this.get("validationErrors");
		validationErrors.clear();

		_.each(errorsList, function(error) {
			if (error.extras) {
				_.each(error.extras, function(message, key) {
					key = self.getServerExtraKeyMapping(key);
					validationErrors.add(key, "serverError", null, message);
				});
			} else if (error.description) {
				var message;
				if (error.description.indexOf(" - ") > 0) {
					message = error.description.split(" - ")[1];
				} else {
					message = error.description;
				}

				validationErrors.add("", "serverError", null, message);
			} else {
				validationErrors.add("", "serverError", null, error[0]);
			}
		});
	},

	getServerExtraKeyMapping: function(extraKey) {
		return extraKey;
	},

	getConnection: function() {
		return Balanced.Connections.ApiConnection.create({
			apiKey: null
		});
	},

	handleResponse: function(response) {
		return response;
	},

	handleErrorResponse: function(response) {
		this.setValidationErrorsFromServer(response);
	},

	_save: function() {
		Ember.assert("Factories should implement their own _save method");
	},
	save: function() {
		var self = this;

		this.get("validationErrors").clear();
		this.validate();

		if (this.get("isValid")) {
			return this._save()
				.then(function(response) {
					return self.handleResponse(response);
				}, function(xhr) {
					self.handleErrorResponse(xhr.responseJSON);
					return Ember.RSVP.reject(xhr.responseJSON);
				});
		} else {
			return Ember.RSVP.reject({
				errors: [{
					description: "Validation errors",
					extras: this.get("validationErrors.fullMessages")
				}]
			});
		}
	}
});

export default BaseFactory;
