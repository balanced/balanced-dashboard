import PageNavigationView from "./page-navigation";

var TransactionPageNavigationView = PageNavigationView.extend({
	pageType: function() {
		return Balanced.Utils.capitalize(this.get("model.type_name"));
	}.property("model.type_name"),

	title: function() {
		return Balanced.Utils.formatCurrency(this.get("model.amount"));
	}.property("model.amount"),
});


export default TransactionPageNavigationView;
