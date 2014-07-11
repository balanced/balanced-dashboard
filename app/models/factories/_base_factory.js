Balanced.BaseFactory = Ember.Object.extend(Ember.Validations, {
	setValidationErrorsFromServer: function(errorsList) {
		var validationErrors = this.get("validationErrors");
		validationErrors.clear();
		_.each(errorsList, function(error) {
			validationErrors.add("", "serverError", null, error.description);
		});
	},

	getConnection: function() {
		return new Balanced.AjaxConnection(ENV.BALANCED.API);
	},

	handleResponse: function(response) {
		return response;
	},

	handleErrorResponse: function(response) {
		this.setValidationErrorsFromServer(response && response.errors);
	},

	isComplete: false,
	save: function() {
		var deferred = Ember.RSVP.defer();
		var self = this;

		this.get("validationErrors").clear();
		this.validate();

		if (this.get("isValid")) {
			this.getConnection()
				.post(this.getPostUrl(), this.getPostAttributes())
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
