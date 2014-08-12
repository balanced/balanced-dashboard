Balanced.MarketplacesApplyRoute = Balanced.Route.extend({
	renderTemplate: function() {
		var self = this;
		this.render("marketplaces.index");
		Ember.run.next(function() {
			self.send("openModal", Balanced.ApiKeyCreateModalView);
		});
	},
});
