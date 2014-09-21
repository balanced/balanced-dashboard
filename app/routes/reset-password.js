import Ember from "ember";

var ResetPasswordRoute = Ember.Route.extend({
	setupController: function(controller, model) {
		controller.set("hasError", false);
		this._super(controller, model.rp);
	},

	model: function(params) {
		var rp = this.container.lookup("model:reset-password", {
			isLoaded: true,
			isNew: false,
			token: params.token
		});

		return {
			rp: rp
		};
	}
});

export default ResetPasswordRoute;
