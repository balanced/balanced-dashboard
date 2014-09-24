import Ember from 'ember';

var ForgotPasswordRoute = Ember.Route.extend({
	setupController: function(controller, model) {
		controller.set("hasError", false);
		this._super(controller, model.fp);
	},

	model: function() {
		var fp = this.get("container").lookup("model:forgot-password");
		return {
			fp: fp
		};
	}
});

export default ForgotPasswordRoute;
