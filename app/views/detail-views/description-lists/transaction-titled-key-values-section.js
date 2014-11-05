import TitledKeyValuesSectionView from "./titled-key-values-section";
import ListValueGenerator from "./list-value-generator";

var TransactionTitledKeyValuesSectionView = TitledKeyValuesSectionView.extend({
	keyValueListViews: function() {
		var idTitle = "%@ ID".fmt(this.get("model.type_name"));
		return [
			this.getKeyValueView("Created at", "created_at"),
			this.getKeyValueView(idTitle, "id"),
			this.getKeyValueView("Transaction number", "transaction_number"),
			this.getKeyValueView("On statement as", "appears_on_statement_as")
		];
	}.property("model", "model.id", "model.transaction_number", "model.description", "model.appears_on_statement_as")
});

export default TransactionTitledKeyValuesSectionView;
