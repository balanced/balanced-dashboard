Balanced.KeyValueView = Ember.View.extend({
	templateName: "detail_views/key_value",
	hasLink: false,
	isEditable: false
});

Balanced.LinkedKeyValueView = Balanced.KeyValueView.extend({
	hasLink: true
});

Balanced.EditableKeyValueView = Balanced.KeyValueView.extend({
	isEditable: true,
	actions: {
		openModal: function(modalView, model) {
			this.send("openModal", modelView, model);
		}
	}
});
