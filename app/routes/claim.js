Balanced.ClaimRoute = Balanced.Route.extend({

	parseResponse: function(unparsedJson) {
		unparsedJson = unparsedJson || '{}';
		var json = JSON.parse(unparsedJson);
		for (var key in json) {
			if (!json.hasOwnProperty(key)) {
				continue;
			}
			this.get('validationErrors').add(key, 'invalid', null, json[key]);
		}
		this.propertyDidChange('validationErrors');
	},

	model: function() {
		var claim = Balanced.Claim.create();

		claim.one('becameInvalid', $.proxy(this.parseResponse, claim));
		claim.one('becameError', $.proxy(this.parseResponse, claim));

		return {
			claim: claim
		};
	},

	setupController: function(controller, model) {
		controller.set('content', model.claim);
	},

	redirect: function() {
		if (!Balanced.Auth.get('isGuest')) {
			this.transitionTo('index');
		}
	},

	actions: {
		signUp: function(someShitThatsNotTheModel, event) {
			var self = this;
			var model = this.currentModel.claim;
			var authToken = Balanced.Auth.get('authToken');

			//  bug in ember-validation requires this extra check for length
			if (!model.validate() && model.get('validationErrors.length')) {
				return;
			}

			model.save().then(function(user) {
				Balanced.Auth.signIn(user.get('email_address'), user.get('passwordConfirm')).then(function() {
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
		},

		cancel: function() {
			this.transitionTo('index');
		}
	}
});
