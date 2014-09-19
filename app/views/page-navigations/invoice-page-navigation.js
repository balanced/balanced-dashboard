import PageNavigationView from "./page-navigation";

var InvoicePageNavigationView = PageNavigationView.extend({
	pageType: function() {
		return '%@: %@'.fmt(this.get('model.type_name'), this.get('model.invoice_type'));
	}.property("model.type_name", "model.invoice_type"),

	title: function() {
		return this.get("model.page_title");
	}.property("model.page_title"),
});

export default InvoicePageNavigationView;
