Balanced.ModalView = Balanced.View.extend({
    /*
     *   A view that will encapsulate a modal box
     *   This will fire events to the controller, primarily prefixEvent_close
     *   and prefixEvent_primary where close and primary are rel tags on the
     *   links/buttons of your controller. It will bind to data from the
     *   controller.
     */
    element: null,
    eventPrefix: null,
    prefixEvent: function (eventName) {
        return this.eventPrefix + '_' + eventName;
    },
    didInsertElement: function () {
        $(this.element).modal('show');
        Ember.assert(this.eventPrefix !== null, 'No event prefix given');
        Ember.assert(this.element !== null, 'No element specified');
    },
    willDestroyElement: function () {
        $(this.element).modal('hide');
    },
    click: function (e) {
        var target = e.target,
            targetRel = target.getAttribute('rel');
        switch (targetRel) {
            case 'close':
            case 'primary':
                this.get('controller').send(this.prefixEvent(targetRel));
                break;
        }
    }
});

Balanced.DownloadModalView = Balanced.ModalView.extend({
    templateName: 'modals/download',
    element: '#download-confirm',
    eventPrefix: 'download'
});
