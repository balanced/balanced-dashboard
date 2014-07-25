Balanced.IndexRoute = Balanced.AuthRoute.extend({
	redirect: function() {
		this.transitionTo('marketplaces');
	}
});
