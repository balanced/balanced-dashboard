import TitledKeyValuesSectionView from "./titled-key-values-section";
import ListValueGenerator from "./list-value-generator";

var OrderTitledKeyValuesSectionView = TitledKeyValuesSectionView.extend({
	keyValueListViews: ListValueGenerator.create()
		.add("Created at", "created_at")
		.add("Order ID", "id")
		.toProperty()
});

export default OrderTitledKeyValuesSectionView;
