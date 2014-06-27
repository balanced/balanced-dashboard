module("Balanced.SidebarView");

test("#dropdownDisplayLabel", function(assert) {
	var view = Balanced.SidebarView.create();

	assert.deepEqual(view.get("dropdownDisplayLabel"), "Marketplaces");

	view.set("marketplace", {
		name: "Super Cool MP"
	});

	assert.deepEqual(view.get("dropdownDisplayLabel"), "Super Cool MP");
	view.set("marketplace", null);
	assert.deepEqual(view.get("dropdownDisplayLabel"), "Marketplaces");
});

test("#sidebarItemsDefinition", function(assert) {
	var view = Balanced.MarketplaceSidebarView.create({
		marketplace: {
			name: "Super Cool MP"
		}
	});

	assert.deepEqual(view.get("items.length"), 6);
	view.set("marketplace", null);
	assert.deepEqual(view.get("items.length"), 0);
});
