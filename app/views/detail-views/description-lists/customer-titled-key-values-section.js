import TitledKeyValuesSectionView from "./titled-key-values-section";
import ListValueGenerator from "./list-value-generator";

var CustomerTitledKeyValuesSectionView = TitledKeyValuesSectionView.extend({
	title: "Customer information",
	editModelModalClass: function() {
		return this.get("container").lookupFactory("view:modals/edit-customer-info-modal");
	}.property("model"),

	keyValueListViews: ListValueGenerator.create()
		.add("Created at", "created_at")
		.add("Customer ID", "id")
		.add("Business Name", "business_name")
		.add("EIN", "ein")
		.add("Name", "name")
		.add("Email address", "email", "email")
		.add("Address line 1", "address.line1")
		.add("Address line 2", "address.line2")
		.add("City", "address.city")
		.add("State", "address.state")
		.add("Postal code", "address.postal_code")
		.add("Country", "country_name")
		.add("Phone number", "phone")
		.add("Date of birth", "dob")
		.add("SSN", "ssn_last4")
		.add("Country", "country_name")
		.add("Facebook ID", "facebook_id", "facebook_url")
		.add("Twitter ID", "twitter_id", "twitter_url")
		.toProperty()
});

export default CustomerTitledKeyValuesSectionView;
