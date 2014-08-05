Balanced.CreateMarketplaceFormView = Balanced.View.extend({
	templateName: "forms/create_marketplace_form",

	isSaving: false,
	actions: {
		save: function(model) {
			var self = this;
			var apiKeySecret = model.get("apiKeySecret");
			self.set("isSaving", true);
			model
				.save()
				.then(function(href) {
					self.set("isSaving", false);
					self.get("controller").send("marketplaceCreated", href, apiKeySecret);
				}, function() {
					self.set("isSaving", false);
				});
		},
	}
});
