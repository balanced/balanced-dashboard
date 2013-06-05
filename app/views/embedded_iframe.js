Balanced.EmbeddedIframeView = Balanced.View.extend({
    templateName: 'embedded_iframe',
    resizer: null,
    RESIZE_CHECK_INTERVAL: 1000,
    // NEVER show iframes while testing - it crashes PhantomJS!
    isVisible: !(window.TESTING),

    didInsertElement: function () {
        var self = this;

        //  HACK: this is here as a lesson about what not to do :)
        if (window.TESTING) {
            return;
        }

        function onIframeTrigger(resizeFunction, iframe) {
            var resizeInterval = self.RESIZE_CHECK_INTERVAL;

            if (self.resizer || !resizeInterval) {
                return;
            }

            self.resizer = setInterval(function () {
                resizeFunction(iframe);
            }, resizeInterval);
        }

        var $embeddedContent = $('#embedded-dashboard-content');

        $('iframe.auto-height').iframeAutoHeight({
            debug: false,
            minHeight: 400,
            triggerFunctions: [
                onIframeTrigger
            ],
            callback: Balanced.Helpers.updateNavigationHeight
        });

        try {
            self.get('controller').set('iframeLoading', true);
        } catch (error) {}

        $embeddedContent.load(function () {
            // Fire this in case the server redirected
            self.updateHashFromIframeLocation(this.contentWindow.location.pathname);
            try {
                self.get('controller').set('iframeLoading', false);
            } catch (error) {}

            // Add a handler to links so we can change the page BEFORE the page loads
            $embeddedContent.contents().find('a').click(function (event) {
                var addressValue = $(this).attr('href');
                if (!event.isDefaultPrevented()) {
                    self.updateHashFromIframeLocation(addressValue);
                }
            });
        });
    },

    updateHashFromIframeLocation: function (iframePath) {
        var transitionToDest = iframePath;
        if (!transitionToDest) {
            return;
        }
        if (transitionToDest.indexOf('?') !== -1) {
            transitionToDest = transitionToDest.substring(0, transitionToDest.indexOf('?'));
        }
        var newHash = '#' + transitionToDest;
        if (transitionToDest !== '#' && newHash !== window.location.hash) {
            window.location.hash = '#' + transitionToDest;
        }
    },

    willDestroyElement: function () {
        if (this.resizer) {
            clearInterval(this.resizer);
        }
        this.resizer = null;
    }
});
