Balanced.ResetPasswordRoute = Balanced.Route.extend({
	setupController: function(controller, model) {
		controller.setProperties({
			submitted: false,
			hasError: false
		});

		this._super(controller, model.rp);
	},

	model: function(params) {
		var rp = Balanced.ResetPassword.create({
			isLoaded: true,
			isNew: false,
			token: params.token
		});

		return {
			rp: rp
		};
	}
});
