Balanced.PopoverView = Balanced.View.extend({
	tagName: 'a',
	attributeBindings: ['class', 'data-toggle', 'data-placement', 'data-original-title', 'data-content', 'data-html'],
	'data-toggle': 'popover',

	didInsertElement: function() {
		this.$().popover();
		this._super();
	}
});
