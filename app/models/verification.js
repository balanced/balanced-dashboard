Balanced.Verification = Balanced.Model.extend({
	no_attempts_remaining: Ember.computed.equal('attempts_remaining', 0),
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

Balanced.TypeMappings.addTypeMapping('bank_account_verification', 'Balanced.Verification');
