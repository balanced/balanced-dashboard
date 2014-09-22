import AuthRoute from "balanced-dashboard/routes/auth";

function createRedirectRoute(routeName, modelFor, baseRoute) {
	baseRoute = baseRoute || AuthRoute;
	modelFor = modelFor || 'marketplace';

	return baseRoute.extend({
		redirect: function() {
			this.transitionTo(routeName, this.modelFor(modelFor));
		}
	});
}

export default createRedirectRoute;
