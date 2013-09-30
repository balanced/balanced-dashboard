// We need a temporary route for logout so the views don't have to assume that
// the Balanced.Auth.user can be null for logged in pages
Balanced.LogoutRoute = Balanced.Route.extend({
	pageTitle: 'Logout',

	redirect: function() {
		var self = this;
		Balanced.Auth.signOut().then(function() {
			self.transitionTo('login');
		});
	}
});
