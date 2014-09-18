Balanced.PageNavigationView = Ember.View.extend({
	layoutName: "page_navigations/page_navigation_layout",
});

Balanced.TransactionPageNavigationView = Balanced.PageNavigationView.extend({
	pageType: function() {
		return Balanced.Utils.capitalize(this.get("model.type_name"));
	}.property("model.type_name"),

	title: function() {
		return Balanced.Utils.formatCurrency(this.get("model.amount"));
	}.property("model.amount"),
});

Balanced.InvoicePageNavigationView = Balanced.PageNavigationView.extend({
	pageType: function() {
		return '%@: %@'.fmt(this.get('model.type_name'), this.get('model.invoice_type'));
	}.property("model.type_name", "model.invoice_type"),

	title: function() {
		return this.get("model.page_title");
	}.property("model.page_title"),
});
