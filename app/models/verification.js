Balanced.Verification = Balanced.Model.extend({
	allowed_attempts: function() {
		return this.get('remaining_attempts') + this.get('attempts');
	}.property('remaining_attempts', 'attempts'),

	no_remaining_attempts: function() {
		return this.get('remaining_attempts') === 0;
	}.property('remaining_attempts'),

	// hide the deposit_succeeded state to keep things less confusing
	display_state: function() {
		var state = this.get('state');

		if (state === 'deposit_succeeded') {
			return 'pending';
		}
		return state;
	}.property('state')
});

Balanced.TypeMappings.addTypeMapping('bank_account_authentication', 'Balanced.Verification');
