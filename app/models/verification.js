Balanced.Verification = Balanced.Model.extend({
	allowed_attempts: function() {
		return this.get('remaining_attempts') + this.get('attempts');
	}.property('remaining_attempts', 'attempts')
});

Balanced.TypeMappings.addTypeMapping('verification', 'Balanced.Verification');
