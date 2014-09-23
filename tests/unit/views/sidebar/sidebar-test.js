import { test, moduleFor } from 'ember-qunit';
moduleFor("view:sidebar/sidebar", "View - Sidebar");

test("#dropdownDisplayLabel", function() {
	var view = this.subject();

	deepEqual(view.get("dropdownDisplayLabel"), "Marketplaces");

	view.set("marketplace", {
		name: "Super Cool MP"
	});

	deepEqual(view.get("dropdownDisplayLabel"), "Super Cool MP");
	view.set("marketplace", null);
	deepEqual(view.get("dropdownDisplayLabel"), "Marketplaces");
});

