Balanced.KeyValueView = Ember.View.extend({
	templateName: "key_value",
	hasLink: false
});

Balanced.LinkedKeyValueView = Balanced.KeyValueView.extend({
	hasLink: true
});
