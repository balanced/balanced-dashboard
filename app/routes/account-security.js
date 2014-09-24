import AuthRoute from "./auth";
import Model from "balanced-dashboard/models/core/model";

var NOT_ALLOWED_ROUTES = ['shapeshifter', 'login', 'logout', 'claim', 'apply'];

var AccountSecurityRoute = AuthRoute.extend({
	pageTitle: 'Account Security',

	setupController: function(controller, model) {
		controller.reset();
		controller.set('status', this.get('auth.user.otp_enabled') ? 'enabled' : 'disabled');

		this._super(controller, model.emptyModel);
	},

	model: function() {
		var emptyModel = Model.create();

		return {
			emptyModel: emptyModel
		};
	},

	beforeModel: function(transition) {
		var router = this.get("container").lookup('router:main').get('router');
		var currentHandlerInfos = router.currentHandlerInfos;
		if (!currentHandlerInfos || !currentHandlerInfos.length) {
			this.previousHandler = null;
			return;
		}

		var previousHandler = currentHandlerInfos[currentHandlerInfos.length - 1];
		this.previousHandler = previousHandler;
	},

	goBack: function() {
		var name = this.previousHandler && this.previousHandler.name;

		if (NOT_ALLOWED_ROUTES.indexOf(name) >= 0) {
			name = null;
		}

		if (!name) {
			name = 'marketplaces';
			return;
		}

		// If context is undefined, EmberJS errors out
		// because it checks the arugments array
		if (this.previousHandler.context) {
			this.transitionTo(name, this.previousHandler.context);
		} else {
			this.transitionTo(name);
		}

		this.previousHandler = null;
	},

	actions: {
		goBack: function() {
			return this.goBack();
		}
	}
});

export default AccountSecurityRoute;
