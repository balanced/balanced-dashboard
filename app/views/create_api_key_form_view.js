Balanced.CreateApiKeyFormView = Balanced.View.extend({
	templateName: "forms/create_api_key_form",

	apiKeyTypes: [{
		value: "person",
		label: "Individual"
	}, {
		value: "business",
		label: "Business: Corporation"
	}],

	businessTypes: Balanced.Marketplace.COMPANY_TYPES,

	isSaving: false,

	actions: {
		save: function(model) {
			var self = this;
			model.save()
				.then(function(apiKeySecret) {
					self.set("isSaving", false);
					self.get("controller").send("apiKeyCreated", apiKeySecret);
				}, function() {
					self.set("isSaving", false);
				});
		},
	}
});
