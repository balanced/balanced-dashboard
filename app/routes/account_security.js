Balanced.AccountSecurityRoute = Balanced.Route.extend({
	pageTitle: 'Account Security',

	setupController: function(controller, model) {
		controller.set('submitted', false);
		controller.set('hasError', false);
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
