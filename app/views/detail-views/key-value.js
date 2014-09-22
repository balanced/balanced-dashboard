Balanced.KeyValueView = Ember.View.extend({
	templateName: "detail-views/key-value",
	hasLink: false,
});

Balanced.LinkedKeyValueView = Balanced.KeyValueView.extend({
	hasLink: true
});
