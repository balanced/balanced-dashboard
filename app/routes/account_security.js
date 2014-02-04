Balanced.AccountSecurityRoute = Balanced.AuthRoute.extend({
	pageTitle: 'Account Security',

	setupController: function(controller, model) {
		controller.reset();
		controller.set('status', Balanced.Auth.get('user.otp_enabled') ? 'enabled' : 'disabled');

		this._super(controller, model.emptyModel);
	},

	model: function() {
		var emptyModel = Balanced.Model.create();

		return {
			emptyModel: emptyModel
		};
	}
});
