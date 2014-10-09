import TitledKeyValuesSectionView from "./titled-key-values-section";
import ListValueGenerator from "./list-value-generator";

var SettingsOwnerTitledKeyValuesSectionView = TitledKeyValuesSectionView.extend({
	classNameBindings: [":owner-info"],
	title: "Owner information",
	editModelModalClass: function() {
		if (Ember.isBlank(this.get("model"))) {
			return undefined;
		}
		return this.get("container").lookupFactory("view:modals/edit-customer-info-modal").extend({
			customer: this.get("model"),
			marketplaceOwner: true
		});
	}.property("model"),

	keyValueListViews: ListValueGenerator.create()
		.add("Type", "type")
		.add("Name", "display_me")
		.add("Email address", "email", "email")
		.add("Address line 1", "address.line1")
		.add("Address line 2", "address.line2")
		.add("City", "address.city")
		.add("State", "address.state")
		.add("Postal code", "address.postal_code")
		.add("Country", "address.country_code")
		.add("Phone number", "phone")
		.toProperty()
});

export default SettingsOwnerTitledKeyValuesSectionView;
