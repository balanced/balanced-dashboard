var SIDEBAR_ITEMS = [{
	linkText: "Activity",
	linkIcon: "icon-activity",
	routeName: "activity.transactions"
}, {
	linkText: "Logs",
	linkIcon: "icon-logs",
	routeName: "logs.index",
}, {
	routeName: 'invoices.index',
	linkIcon: "icon-invoices",
	linkText: "Invoices",
}, {
	routeName: "marketplace.settings",
	linkIcon: 'icon-settings',
	linkText: 'Settings'
}];

Balanced.MarketplaceSidebarView = Ember.View.extend({
	items: function() {
		return SIDEBAR_ITEMS.map(function(itemHash) {
			return Balanced.BasicLinkSidebarItemView.create(itemHash);
		});
	}.property()
});
