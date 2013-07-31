Balanced.PopoverView = Balanced.View.extend({
    tagName: 'a',
    attributeBindings: ['data-toggle', 'data-placement', 'data-original-title', 'data-content'],
    'data-toggle': 'popover',

    didInsertElement: function () {
        this.$().popover();
    }
});
