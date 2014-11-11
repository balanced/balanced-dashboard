import KeyValueGenerator from "balanced-dashboard/views/detail-views/description-lists/key-value-generator";

var KeyboardShortcutsView = Ember.View.extend({
	shortcuts: KeyValueGenerator.create()
		.add("Bring up serach", "/")
		.add("Move selection up", "&#8593;")
		.add("Move selection down", "&#8595;")
		.add("Open selection", "enter")
		.add("Exit search", "esc")
		.values
});

export default KeyboardShortcutsView;
