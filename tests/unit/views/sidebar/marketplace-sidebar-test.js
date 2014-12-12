import { test, moduleFor } from 'ember-qunit';
moduleFor("view:sidebar/marketplace-sidebar", "View - MarketplaceSidebar", {
	needs: ["view:sidebar/basic-link-sidebar-item"]
});

test("#sidebarItemsDefinition", function() {
	var view = this.subject({
		marketplace: {
			name: "Super Cool MP"
		}
	});

	deepEqual(view.get("items.length"), 7);
	view.set("marketplace", null);
	deepEqual(view.get("items.length"), 0);
});
