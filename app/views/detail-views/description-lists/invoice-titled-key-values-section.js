import TitledKeyValuesSectionView from "./titled-key-values-section";
import ListValueGenerator from "./list-value-generator";

var InvoiceTitledKeyValuesSectionView = TitledKeyValuesSectionView.extend({
	keyValueListViews: ListValueGenerator.create()
		.add("Created at", "created_at")
		.add("Invoice ID", "id")
		.add("From", "from_date")
		.add("To", "to_date")
		.toProperty()
});

export default InvoiceTitledKeyValuesSectionView;
