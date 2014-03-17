// Hack to make it injest whatever value is there
Ember.TextField.reopen({
	didInsertElement: function() {
		var self = this;

		// Let it be defered for the Browser/password managers
		// to put in the value into the textfield
		_.defer(function() {
			// Check if the textfield is valid in DOM
			if (!self.isVisible || self.isDestroyed || self.isDestroying) {
				return;
			}

			// Call hidden function _elementValueDidChange
			// when value of textfield changes.
			self._elementValueDidChange();
		});
	}
});

Balanced.Forms = {
	TextField: Ember.TextField.extend({
		attributeBindings: ['autocomplete', 'placeholder', 'autofocus']
	})
};
