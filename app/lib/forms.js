// Hack to make it injest whatever value is there
Ember.TextField.reopen({
	didInsertElement: function() {
		// Call hidden function _elementValueDidChange
		// when value of textfield changes.
		_.defer(_.bind(this._elementValueDidChange, this));
	}
});

Balanced.Forms = {
	TextField: Ember.TextField.extend({
		attributeBindings: ['autocomplete', 'placeholder', 'autofocus']
	})
};
