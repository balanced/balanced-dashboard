var Save = Balanced.Modals.ObjectValidateAndSaveMixin;

Balanced.ApiKeyCreateModalView = Balanced.RegisterFlowBaseModal.extend(Save, {
	templateName: "register_flow/api_key_create_modal",
	title: "Register for a production marketplace",
	subtitle: "Step 1 of 3: Provide business information",
	submitButtonText: "Continue",

	apiKeyTypes: [{
		value: "person",
		label: "Individual"
	}, {
		value: "business",
		label: "Business: Corporation"
	}],

	businessTypes: Balanced.Marketplace.COMPANY_TYPES,

	model: function() {
		return Balanced.ApiKeyFactory.create({
			merchant: {
				type: "person",
				phone_number: "11111",
				postal_code: ""
			},
			business: {
				company_type: "llc",
				name: "Cccccc",
				incorporation_date: "2000-10",
				tax_id: "1111"
			},
			person: {
				name: "Cool",
				ssn_last_4: "1111",
				dob: "2000-10",
				postal_code: "33333"
			},
		});
	}.property(),

	actions: {
		nextStep: function(apiKeySecret) {
			this.openNext(Balanced.MarketplaceCreateModalView, apiKeySecret);
		},
		save: function() {
			var self = this;
			var model = this.get("model");
			this.save(model)
				.then(function(apiKeySecret) {
					self.send("nextStep", apiKeySecret);
				});
		}
	}
});
