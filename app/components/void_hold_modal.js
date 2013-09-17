Balanced.VoidHoldModalComponent = Ember.Component.extend({
    classNames: ['modal-container'],

    willDestroyElement: function() {
        $('#void-hold').modal('hide');
    },

    open: function () {
        $('#void-hold').modal('show');
    },

    save: function () {
        if (this.get('hold.isSaving')) {
            return;
        }

        var hold = this.get('hold');
        hold.set('is_void', true);
        hold.save();
    }
});
