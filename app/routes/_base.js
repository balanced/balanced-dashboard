Balanced.AuthRoute = Balanced.Route.extend({
	getUser: function() {
		return this.get("auth.user");
	},
	beforeModel: function(transition) {
		if (!this.get('auth.signedIn')) {
			this.transitionTo('login');
		}
	}
});

Balanced.TitleRoute = Balanced.AuthRoute.extend({
	title: 'Model',

	pageTitle: function(route, setTitle) {
		var model = route.controller.content;
		var title = route.get('title');

		return Balanced.Utils.maybeDeferredLoading(model, setTitle, function() {
			return title + ': loading ...';
		}, function() {
			return title + ': %@'.fmt(model.get('page_title'));
		});
	}
});

Balanced.ModelRoute = Balanced.TitleRoute.extend({
	model: function(params) {
		var marketplace = this.modelFor('marketplace');
		var modelObject = this.get('modelObject');
		var uri = this.get('marketplaceUri');

		return marketplace.then(function(marketplace) {
			var modelUri = Balanced.Utils.combineUri(marketplace.get(uri), params.item_id);
			return modelObject.find(modelUri);
		});
	}
});

Balanced.ModelControllerRoute = Balanced.ModelRoute.extend({
	setupController: function(controller, model) {
		this._super(controller, model);
		controller.send('reload');
	}
});

Balanced.ControllerRoute = Balanced.AuthRoute.extend({
	setupController: function(controller, model) {
		controller.send('reload');
	}
});

Balanced.RedirectRoute = function redirectRoute(routeName, modelFor, baseRoute) {
	baseRoute = baseRoute || Balanced.AuthRoute;
	modelFor = modelFor || 'marketplace';

	return baseRoute.extend({
		redirect: function() {
			this.transitionTo(routeName, this.modelFor(modelFor));
		}
	});
};
