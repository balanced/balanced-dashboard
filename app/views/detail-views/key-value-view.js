Balanced.KeyValueView = Ember.View.extend({
	templateName: "detail_views/key_value",
	hasLink: false,
});

Balanced.LinkedKeyValueView = Balanced.KeyValueView.extend({
	hasLink: true
});
