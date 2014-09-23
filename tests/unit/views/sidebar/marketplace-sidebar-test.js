import { test, moduleFor } from 'ember-qunit';
moduleFor("view:sidebar/marketplace-sidebar", "View - MarketplaceSidebar");

test("#sidebarItemsDefinition", function() {
	var view = this.subject({
		marketplace: {
			name: "Super Cool MP"
		}
	});

	deepEqual(view.get("items.length"), 6);
	view.set("marketplace", null);
	deepEqual(view.get("items.length"), 0);
});
