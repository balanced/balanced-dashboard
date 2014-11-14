import KeyValueGenerator from "balanced-dashboard/views/detail-views/description-lists/key-value-generator";

var KeyboardShortcutsView = Ember.View.extend({
	shortcuts: KeyValueGenerator.create()
		.add("Bring up search", "/")
		.add("Exit search", "esc")
		.values
});

export default KeyboardShortcutsView;
