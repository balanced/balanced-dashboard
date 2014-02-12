Balanced.LoadingRoute = Balanced.Route.extend({
	deactivate: function() {
		var timer = this.get('timer');
		if (timer) {
			Ember.run.cancel(timer);
		}
	},

	renderTemplate: function(controller, model) {
		var self = this;
		// Only render the loading indicator after 0.25s
		var timer = Ember.run.later(this, function() {
			self.render('loading');
		}, 250);

		this.set('timer', timer);
	}
});
