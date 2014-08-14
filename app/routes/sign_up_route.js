require("app/routes/start");

Balanced.SignUpRoute = Balanced.StartRoute.extend({
	renderTemplate: function() {
		var self = this;
		this.render("start");
		Ember.run.next(function() {
			self.send("openModal", Balanced.UserCreateModalView);
		});
	},
});
