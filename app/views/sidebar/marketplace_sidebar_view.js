var SIDEBAR_ITEMS = [{
	linkText: "Activity",
	linkIcon: "icon-activity",
	routeName: "activity.transactions",
	children: [{
		routeName: "activity.transactions",
		linkText: "Transactions",
	}, {
		routeName: "activity.orders",
		linkText: "Orders"
	}]
}, {
	linkText: "Customers",
	linkIcon: "icon-customers",
	routeName: "marketplace.customers"
}, {
	linkText: "Payment Methods",
	linkIcon: "icon-card",
	routeName: "marketplace.funding_instruments"
},{
	linkText: "Disputes",
	linkIcon: "icon-disputes",
	routeName: "marketplace.disputes"
}, {
	linkText: "Logs",
	linkIcon: "icon-logs",
	routeName: "marketplace.logs",
}, {
	linkText: "My Marketplace",
	linkIcon: "icon-my-marketplace",
	routeName: "marketplace.settings",
	children: [{
		routeName: "marketplace.settings",
		linkIcon: 'icon-settings',
		linkText: 'Settings'
	}, {
		routeName: 'marketplace.invoices',
		linkIcon: "icon-invoices",
		linkText: "Invoices",
	}]
}];

Balanced.MarketplaceSidebarView = Ember.View.extend({
	items: function() {
		return SIDEBAR_ITEMS.map(function(itemHash) {
			return Balanced.BasicLinkSidebarItemView.create(itemHash);
		});
	}.property()
});
