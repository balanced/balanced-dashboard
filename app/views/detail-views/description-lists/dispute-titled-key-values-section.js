import TransactionTitledKeyValuesSectionView from "./transaction-titled-key-values-section";
import ListValueGenerator from "./list-value-generator";

var DisputeTitledKeyValuesSectionView = TransactionTitledKeyValuesSectionView.extend({
	editModelModalClass: function() {
		return undefined;
	}.property(),

	keyValueListViews: ListValueGenerator.create()
		.add("Created at", "created_at")
		.add("Dispute ID", "id")
		.add("Initiated at", "initiated_at")
		.add("Respond by", "respond_by")
		.add("Reason", "reason")
		.toProperty()
});

export default DisputeTitledKeyValuesSectionView;
