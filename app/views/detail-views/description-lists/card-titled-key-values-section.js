import TitledKeyValuesSectionView from "./titled-key-values-section";
import ListValueGenerator from "./list-value-generator";

var CardTitledKeyValuesSectionView = TitledKeyValuesSectionView.extend({
	title: "Card information",

	keyValueListViews: ListValueGenerator.create()
		.add("Created at", "created_at")
		.add("Card ID", "id")
		.add("Name on account", "name")
		.add("Type", "type_name")
		.add("Bank", "formatted_bank_name")
		.add("Expiration date", "human_readable_expiration")
		.add("Address line 1", "address.line1")
		.add("Address line 2", "address.line2")
		.add("City", "address.city")
		.add("State", "address.state")
		.add("Postal code", "address.postal_code")
		.add("Country", "address.country_code")
		.toProperty()
});

export default CardTitledKeyValuesSectionView;
