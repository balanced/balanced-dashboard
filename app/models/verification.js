Balanced.Verification = Balanced.Model.extend({
	allowed_attempts: function() {
		return this.get('remaining_attempts') + this.get('attempts');
	}.property('remaining_attempts', 'attempts'),

	no_remaining_attempts: function() {
        return this.get('remaining_attempts') === 0;
    }.property('remaining_attempts')
});

Balanced.TypeMappings.addTypeMapping('verification', 'Balanced.Verification');
