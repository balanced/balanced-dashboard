import TitledKeyValuesSectionView from "./titled-key-values-section";
import ListValueGenerator from "./list-value-generator";

var SettingsMarketplaceTitledKeyValuesSectionView = TitledKeyValuesSectionView.extend({
	classNameBindings: [":marketplace-info"],
	title: "Marketplace information",
	editModelModalClass: function() {
		return this.get("container").lookupFactory("view:modals/marketplace-edit-modal");
	}.property("model"),

	keyValueListViews: ListValueGenerator.create()
		.add("Created at", "created_at")
		.add("Marketplace ID", "id")
		.add("Name", "name")
		.add("Support email address", "support_email_address", "support_email_address")
		.add("Domain URL", "domain_url", "domain_url")
		.add("Support phone number", "support_phone_number")
		.toProperty()
});

export default SettingsMarketplaceTitledKeyValuesSectionView;
