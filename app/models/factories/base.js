import Ember from "ember";
import ApiConnection from "balanced-dashboard/lib/connections/api-connection";
import ServerError from "balanced-dashboard/utils/error-handlers/validation-server-error-handler";

var BaseFactory = Ember.Object.extend(Ember.Validations, {
	setValidationErrorsFromServer: function(response) {
		var serverError = new ServerError(this, response);
		serverError.clear();
		serverError.execute();
	},

	getServerExtraKeyMapping: function(extraKey) {
		return extraKey;
	},

	getConnection: function() {
		return ApiConnection.create({
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
