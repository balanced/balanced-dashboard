var SIDEBAR_ITEMS = [{
	linkText: "Payments",
	linkIcon: "icon-payments",
	routeName: "activity.transactions",
	isSelectedBinding: "controller.marketplace.paymentSelected",
	children: [{
		routeName: "activity.transactions",
		linkText: "Transactions",
		isSelectedBinding: "controller.marketplace.transactionSelected"
	}, {
		routeName: "activity.orders",
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
	isSelectedBinding: "controller.marketplace.disputeSelected"
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

Balanced.SidebarView = Ember.View.extend({
	templateName: "sidebar/marketplace_sidebar",
	items: function() {
		return [];
	}.property()
});

Balanced.MarketplaceSidebarView = Balanced.SidebarView.extend({
	dropdownDisplayLabel: function() {
		return this.get("marketplace") ?
			this.get("marketplace.name") :
			"Marketplaces";
	}.property("marketplace", "marketplace.name"),

	sidebarItemsDefinition: function() {
		return this.get("marketplace") ?
			SIDEBAR_ITEMS : [];
	}.property("marketplace"),

	items: function() {
		return this.get("sidebarItemsDefinition")
			.map(function(itemHash) {
				return Balanced.BasicLinkSidebarItemView.create(itemHash);
			});
	}.property("sidebarItemsDefinition")
});
