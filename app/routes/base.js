Balanced.Route = Ember.Route.extend();

import AuthRoute from "./auth";
import TitleRoute from "./title";

Balanced.ModelRoute = TitleRoute.extend({
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

Balanced.ControllerRoute = AuthRoute.extend({
	setupController: function(controller, model) {
		controller.send('reload');
	}
});

Balanced.RedirectRoute = function redirectRoute(routeName, modelFor, baseRoute) {
	baseRoute = baseRoute || AuthRoute;
	modelFor = modelFor || 'marketplace';

	return baseRoute.extend({
		redirect: function() {
			this.transitionTo(routeName, this.modelFor(modelFor));
		}
	});
};
