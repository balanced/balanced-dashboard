import PageNavigationView from "./page-navigation";
import Utils from "balanced-dashboard/lib/utils";

var TransactionPageNavigationView = PageNavigationView.extend({
	pageType: function() {
		return Utils.capitalize(this.get("model.type_name"));
	}.property("model.type_name"),

	title: function() {
		return Utils.formatCurrency(this.get("model.amount"));
	}.property("model.amount"),

	order: function() {
		return this.get("model.order") || this.get("model.debit.order") || this.get("model.transaction.order") || this.get("model.credit.order");
	}.property("model.order", "model.debit.order", "model.transaction.order", "model.credit.order")
});


export default TransactionPageNavigationView;
