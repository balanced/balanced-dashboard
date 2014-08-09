var Full = Balanced.Modals.FullModalMixin;

Balanced.UserCreateModalView = Balanced.ModalBaseView.extend(Full, {
	templateName: "register_flow/user_create_modal",
	title: "Create your account",

	auth: Balanced.Auth,

	model: function() {
		return Balanced.UserAccountFactory.create();
	}.property(),

	save: function(model) {
		model.validate();
		if (model.get("isValid")) {
			return model.save()
				.then(function(userUri) {
					return Ember.RSVP.resolve(userUri);
				}, function(errors) {
					return Ember.RSVP.reject(errors);
				});
		} else {
			return Ember.RSVP.reject();
		}
	},

	isSaving: false,
	actions: {
		save: function() {
			var controller = this.get("controller");

			var self = this;
			var model = this.get("model");
			var authToken = this.get("auth.authToken");

			this.save(model)
				.then(function(userUri) {
					return Balanced.Auth.signIn(model.get('email_address'), model.get('passwordConfirm'));
				})
				.then(function(user) {
					var apiKeysUri = user.get("api_keys_uri");

					if (authToken) {
						return Balanced.UserMarketplace
							.create({
								uri: apiKeysUri,
								secret: authToken
							})
							.save()
							.then(function() {
								return user.reload();
							});
					}
				})
				.then(function() {
					self.close();
					return controller.transitionToRoute('index');
				});
		}
	}
});
