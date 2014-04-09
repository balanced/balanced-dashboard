Balanced.ClaimController = Balanced.ObjectController.extend({
	needs: ['marketplace', 'application'],
	validationErrors: Ember.computed.alias('model.validationErrors'),

	error: function(field, prefix) {
		var errors = this.get('validationErrors.' + field + '.messages');
		if (errors) {
			var error = errors[0];
			if (error.indexOf(prefix) !== 0) {
				error = prefix + ' ' + error;
			}
			return error;
		}
	},

	emailLabel: function() {
		return this.error('email_address', 'Email') || 'Enter your email';
	}.property('validationErrors.email'),

	passwordLabel: function() {
		return this.error('password', 'Password') || 'Create a password';
	}.property('validationErrors.password'),

	passwordConfirmLabel: function() {
		return this.error('passwordConfirm', 'Password') || 'Re-enter your password';
	}.property('validationErrors.passwordConfirm'),

	parseError: function(unparsedJson) {
		unparsedJson = unparsedJson || '{}';
		var json = JSON.parse(unparsedJson);
		_.each(json, function(val, key) {
			this.add(key, 'invalid', null, val);
		}, this.get('validationErrors'));
		this.propertyDidChange('validationErrors');
	},

	actions: {
		save: function() {
			var self = this;
			var model = this.get('model');
			var authToken = this.get('auth.authToken');

			//  bug in ember-validation requires this extra check for length
			if (!model.validate() && model.get('validationErrors.length')) {
				return;
			}

			model.one('becameError', this.parseError);
			model.one('becameInvalid', this.parseError);

			model.save().then(function(user) {
				self.get('auth').signIn(user.get('email_address'), user.get('passwordConfirm')).then(function() {
					// associate marketplace to user
					if (authToken) {
						var marketplace = Balanced.UserMarketplace.create({
							uri: user.api_keys_uri,
							secret: authToken
						});

						marketplace.save().then(function() {
							user.reload().then(function() {
								self.transitionTo('index');
							});
						});
					} else {
						self.transitionTo('index');
					}
				});
			});
		}
	}
});
