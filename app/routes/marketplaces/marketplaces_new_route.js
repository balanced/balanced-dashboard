Balanced.MarketplacesNewRoute = Balanced.Route.extend({
	title: "Apply for production access",
	model: function() {
		return Balanced.ApiKeyFactory.create({
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
				name: "",
				ssn_last_4: "1111",
				dob: "2000-10",
				postal_code: ""
			},
		});
	},
	setupController: function(controller, model) {
		controller.setProperties({
			marketplaceFactory: undefined
		});
		this._super(controller, model);
	},
});
