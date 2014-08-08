var Full = Balanced.Modals.FullModalMixin;
var Save = Balanced.Modals.ObjectValidateAndSaveMixin;

Balanced.ApiKeyCreateModalView = Balanced.ModalBaseView.extend(Full, Save, {
	templateName: "register_flow/api_key_create_modal",
	title: "Apply for production access",

	apiKeyTypes: [{
		value: "person",
		label: "Individual"
	}, {
		value: "business",
		label: "Business: Corporation"
	}],

	businessTypes: Balanced.Marketplace.COMPANY_TYPES,

	actions: {
		save: function() {
			var controller = this.get("controller");
			var model = this.get("model");
			this.save(model)
				.then(function(apiKeySecret) {
					var klass = Balanced.MarketplaceCreateModalView;
					controller.send("openModal", klass, apiKeySecret);
				});
		}
	}
});

Balanced.ApiKeyCreateModalView.reopenClass({
	open: function() {
		var apiKeyFactory = Balanced.ApiKeyFactory.create({
			merchant: {
				type: "business",
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
		return this.create({
			model: apiKeyFactory
		});
	}
});
