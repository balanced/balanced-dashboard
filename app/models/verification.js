Balanced.Verification = Balanced.Model.extend({
	allowed_attempts: function() {
		return this.get('attempts_remaining') + this.get('attempts');
	}.property('attempts_remaining', 'attempts'),

	no_attempts_remaining: function() {
		return this.get('attempts_remaining') === 0;
	}.property('attempts_remaining'),

	// hide the deposit_succeeded state to keep things less confusing
	display_state: function() {
		var state = this.get('verification_status');

		if (state === 'deposit_succeeded') {
			return 'pending';
		}
		return state;
	}.property('state')
});

Balanced.TypeMappings.addTypeMapping('bank_account_verification', 'Balanced.Verification');
