import Ember from "ember";

var ResetPasswordRoute = Ember.Route.extend({
	setupController: function(controller, model) {
		this._super(controller, model);
		controller.set("hasError", false);
	},

	model: function(params) {
		return this.container.lookupFactory("model:reset-password").create({
			isLoaded: true,
			isNew: false,
			token: params.token
		});
	}
});

export default ResetPasswordRoute;
