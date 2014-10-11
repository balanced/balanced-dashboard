import Ember from "ember";
import Model from "./core/model";
import ServerError from "balanced-dashboard/utils/error-handlers/validation-server-error-handler";

var Verification = Model.extend(Ember.Validations, {
	no_attempts_remaining: Ember.computed.equal('attempts_remaining', 0),

	_handleError: function(jqXHR, textStatus, errorThrown) {
		this.set('isSaving', false);

		if (jqXHR.status >= 400 && jqXHR.status < 500) {
			this.set('isValid', false);
			this.trigger('becameInvalid', jqXHR.responseJSON || jqXHR.responseText);
		} else {
			this.setProperties({
				isError: true,
				errorStatusCode: jqXHR.status
			});
			this.trigger('becameError', jqXHR.responseJSON || jqXHR.responseText);
		}

		var response = jqXHR.responseJSON;
		var serverError = new ServerError(this, response);
		serverError.execute();
		this.notifyPropertyChange("validationErrors");
	},

	isVerifiable: function() {
		return this.get("attempts_remaining") > 0;
	}.property("attempts_remaining", "deposit_status"),

	allowed_attempts: function() {
		return this.get('attempts_remaining') + this.get('attempts');
	}.property('attempts_remaining', 'attempts'),

	// hide the deposit_succeeded state to keep things less confusing
	display_state: function() {
		var state = this.get('verification_status');

		if (state === 'deposit_succeeded') {
			return 'pending';
		}

		return state;
	}.property('verification_status')
});

export default Verification;
