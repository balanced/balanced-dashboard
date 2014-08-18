Balanced.BaseFactory = Ember.Object.extend(Ember.Validations, {
	setValidationErrorsFromServer: function(response) {
		var errorsList = response.errors || [];
		var validationErrors = this.get("validationErrors");
		validationErrors.clear();

		_.each(errorsList, function(error) {
			if (error.extras) {
				_.each(error.extras, function(message, key) {
					validationErrors.add(key, "serverError", null, message);
				});
			} else if (error.description) {
				validationErrors.add("", "serverError", null, error.description.split(" - ")[1]);
			} else {
				validationErrors.add("", "serverError", null, error[0]);
			}
		});
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

	isComplete: false,

	_save: function() {
		Ember.assert("Factories should implement their own _save method");
	},
	save: function() {
		var deferred = Ember.RSVP.defer();
		var self = this;

		this.get("validationErrors").clear();
		this.validate();

		if (this.get("isValid")) {
			return this
				._save()
				.then(function(response) {
					self.set("isComplete", true);
					deferred.resolve(self.handleResponse(response));
				}, function(xhr) {
					self.handleErrorResponse(xhr.responseJSON);
					deferred.reject();
				});
		} else {
			deferred.reject();
		}

		return deferred.promise;
	}
});
