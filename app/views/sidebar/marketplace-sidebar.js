import SidebarView from "./sidebar";
import BasicLinkSidebarItemView from "./basic-link-sidebar-item";

var SIDEBAR_ITEMS = [{
	linkText: "Payments",
	linkIcon: "icon-payments",
	routeName: "marketplace.transactions",
	isSelectedBinding: "controller.marketplace.paymentSelected",
	children: [{
		routeName: "marketplace.transactions",
		linkText: "Transactions",
		isSelectedBinding: "controller.marketplace.transactionSelected"
	}, {
		routeName: "marketplace.orders",
		linkText: "Orders",
		isSelectedBinding: "controller.marketplace.orderSelected"
	}]
}, {
	linkText: "Customers",
	linkIcon: "icon-customers",
	routeName: "marketplace.customers",
	isSelectedBinding: "controller.marketplace.customerSelected"
}, {
	linkText: "Payment methods",
	linkIcon: "icon-card",
	routeName: "marketplace.funding_instruments",
	isSelectedBinding: "controller.marketplace.fundingInstrumentSelected"
}, {
	linkText: "Disputes",
	linkIcon: "icon-disputes",
	routeName: "marketplace.disputes",
	isSelectedBinding: "controller.marketplace.disputeSelected",
	alertCountBinding: "controller.marketplace.disputeAlertCount",
}, {
	linkText: "Logs",
	linkIcon: "icon-logs",
	routeName: "marketplace.logs",
	isSelectedBinding: "controller.marketplace.logSelected"
}, {
	linkText: "My marketplace",
	linkIcon: "icon-my-marketplace",
	routeName: "marketplace.invoices",
	isSelectedBinding: "controller.marketplace.myMarketplaceSelected",
	children: [{
		routeName: 'marketplace.invoices',
		linkIcon: "icon-invoices",
		linkText: "Account statements",
		isSelectedBinding: "controller.marketplace.invoiceSelected"
	}, {
		routeName: "marketplace.settings",
		linkIcon: 'icon-settings',
		linkText: 'Settings',
		isSelectedBinding: "controller.marketplace.settingSelected"
	}]
}];


var MarketplaceSidebarView = SidebarView.extend({
	sidebarItemsDefinition: function() {
		return this.get("marketplace") ?
			SIDEBAR_ITEMS : [];
	}.property("marketplace"),

	items: function() {
		return this.get("sidebarItemsDefinition").map(function(itemHash) {
			return BasicLinkSidebarItemView.extend(itemHash);
		});
	}.property("sidebarItemsDefinition")
});

export default MarketplaceSidebarView;
