import Ember from "ember";

var ErrorMessagesCollection = Ember.ArrayProxy.extend({
	populate: function(response, defaultMessage) {
		this.clear();
		var errors = ["Something went wrong while trying to save your information."];

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

export default ErrorMessagesCollection;
