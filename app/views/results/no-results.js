import KeyValueGenerator from "balanced-dashboard/views/detail-views/description-lists/key-value-generator";

var NoResultsView = Ember.View.extend({
	examples: KeyValueGenerator.create()
		.add("Customer name", "John Miller")
		.add("Customer email", "john.miller@example.com")
		.add("Transaction ID", "CRVNt39ZeYJ6ff6IamPNb9o")
		.add("Log ID", "OHMafdf423c658d11e484b40230f00c")
		.add("Description", "Item 251859")
		.add("Payment method (last 4)", "2851")
		.add("Amount", "261.23")
		.values
});

export default NoResultsView;
