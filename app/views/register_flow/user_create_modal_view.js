var Wide = Balanced.Modals.WideModalMixin;
var Save = Balanced.Modals.ValidateAndSaveMixin;

Balanced.UserCreateModalView = Balanced.ModalBaseView.extend(Wide, Save, {
	templateName: "register_flow/user_create_modal",
	title: "Create your account",

	auth: Ember.computed.oneWay("Balanced.Auth"),

	bindUserMarketplace: function(user) {
		var authToken = this.get('auth.authToken');
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
	},

	actions: {
		save: function() {
			var self = this;
			var model = this.get("model");
			var controller = this.get("controller");

			this.save(model)
				.then(function() {
					Balanced.Auth
						.signIn(model.get('email_address'), model.get('passwordConfirm'))
						.then(function() {
							return self.bindUserMarketplace(model);
						})
						.then(function() {
							return controller.transitionToRoute('index');
						});
				});
		}
	}
});

Balanced.UserCreateModalView.reopenClass({
	open: function() {
		var claim = Balanced.Claim.create();
		return this.create({
			model: claim
		});
	}
});
