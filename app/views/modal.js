/*
 *   A view that will encapsulate a modal box
 */
Balanced.ModalView = Balanced.View.extend({
    tagName: 'div',
    classNames: ['modal'],

    didInsertElement: function () {
        this.$().modal('show');

        // Need this to detect hides when the user clicks outside the modal so
        // we can make sure the controller updates its state correctly
        var self = this;
        this.$().on('hide', function() {
            self.get('controller').send('close');
        });
    },

    willDestroyElement: function () {
        // remove the event handler so we don't fire a close twice
        this.$().off('hide');

        this.$().modal('hide');
    }
});
