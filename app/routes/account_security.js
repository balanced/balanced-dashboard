var NOT_ALLOWED_ROUTES = ['shapeshifter'];

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
	},

	beforeModel: function(transition) {
		var router = Balanced.__container__.lookup('router:main').get('router');
		var currentHandlerInfos = router.currentHandlerInfos;
		if (!currentHandlerInfos || !currentHandlerInfos.length) {
			this.previousHandler = null;
			return;
		}

		var previousHandler = currentHandlerInfos[currentHandlerInfos.length - 1];
		if (NOT_ALLOWED_ROUTES.indexOf(previousHandler.name) >= 0) {
			this.previousHandler = null;
			return;
		}

		this.previousHandler = previousHandler;
	},

	goBack: function() {
		var name = this.previousHandler && this.previousHandler.name;

		if (!name) {
			name = 'marketplaces';
			return;
		}

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
