import PageNavigationView from "./page-navigation";
import Utils from "balanced-dashboard/lib/utils";

var TransactionPageNavigationView = PageNavigationView.extend({
	pageType: function() {
		return Utils.capitalize(this.get("model.type_name"));
	}.property("model.type_name"),

	title: function() {
		return Utils.formatCurrency(this.get("model.amount"));
	}.property("model.amount"),
});


export default TransactionPageNavigationView;
