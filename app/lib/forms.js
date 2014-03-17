// Hack to make it injest whatever value is there
Ember.TextField.reopen({
	didInsertElement: function() {
		// Call hidden function _elementValueDidChange
		// when value of textfield changes.
		var self = this;
		_.defer(function() {
			// Check if the textfield is valid in DOM
			if (!self.isVisible || self.isDestroyed || self.isDestroying) {
				return;
			}

			self._elementValueDidChange();
		});
	}
});

Balanced.Forms = {
	TextField: Ember.TextField.extend({
		attributeBindings: ['autocomplete', 'placeholder', 'autofocus']
	})
};
