import TitledKeyValuesSectionView from "./titled-key-values-section";
import ListValueGenerator from "./list-value-generator";

var OrderTitledKeyValuesSectionView = TitledKeyValuesSectionView.extend({
	keyValueListViews: ListValueGenerator.create()
		.add("Order ID", "id")
		.add("Internal description", "description")
		.toProperty()
});

export default OrderTitledKeyValuesSectionView;
