Balanced.ErrorMessagesCollection = Ember.ArrayProxy.extend({
	populate: function(response, defaultMessage) {
		this.clear();
		var errors = ["An unknown error ocurred."];

		if (response.message) {
			errors = [response.message];
		} else if (response.detail) {
			errors = [response.detail];
		} else if (response.description) {
			errors = [response.description];
		} else if (response.errors) {
			errors = response.errors.mapBy("description");
		} else if (defaultMessage) {
			errors = [defaultMessage];
		}

		this.set("content", errors);
	}
});
