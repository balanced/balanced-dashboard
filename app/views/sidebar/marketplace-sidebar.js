import SidebarView from "./sidebar";

var SIDEBAR_ITEMS = [{
	linkText: "Payments",
	linkIcon: "icon-payments",
	routeName: "marketplace.transactions",
	isSelectedBinding: "controller.controllers.marketplace.paymentSelected",
	children: [{
		routeName: "marketplace.transactions",
		linkText: "Transactions",
		isSelectedBinding: "controller.controllers.marketplace.transactionSelected"
	}, {
		routeName: "marketplace.orders",
		linkText: "Orders",
		isSelectedBinding: "controller.controllers.marketplace.orderSelected"
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
	isSelectedBinding: "controller.controllers.marketplace.fundingInstrumentSelected"
}, {
	linkText: "Disputes",
	linkIcon: "icon-disputes",
	routeName: "marketplace.disputes",
	isSelectedBinding: "controller.controllers.marketplace.disputeSelected",
	alertCountBinding: "controller.controllers.marketplace.disputeAlertCount",
}, {
	linkText: "Logs",
	linkIcon: "icon-logs",
	routeName: "marketplace.logs",
	isSelectedBinding: "controller.controllers.marketplace.logSelected"
}, {
	linkText: "My marketplace",
	linkIcon: "icon-my-marketplace",
	routeName: "marketplace.invoices",
	isSelectedBinding: "controller.controllers.marketplace.myMarketplaceSelected",
	children: [{
		routeName: 'marketplace.invoices',
		linkText: "Account statements",
		isSelectedBinding: "controller.controllers.marketplace.invoiceSelected"
	}, {
		routeName: "marketplace.settings",
		linkText: 'Settings',
		isSelectedBinding: "controller.controllers.marketplace.settingSelected"
	}]
}];


var MarketplaceSidebarView = SidebarView.extend({
	sidebarItemsDefinition: function() {
		return this.get("marketplace") ?
			SIDEBAR_ITEMS : [];
	}.property("marketplace"),

	items: function() {
		var BasicLinkSidebarItemView = this.get("container").lookupFactory("view:sidebar/basic-link-sidebar-item");
		return this.get("sidebarItemsDefinition").map(function(itemHash) {
			return BasicLinkSidebarItemView.extend(itemHash);
		});
	}.property("sidebarItemsDefinition")
});

export default MarketplaceSidebarView;
