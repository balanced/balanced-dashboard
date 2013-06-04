Balanced.EmbeddedIframeView = Balanced.View.extend({
    templateName: 'embedded_iframe',
    resizer: null,
    RESIZE_CHECK_INTERVAL: 1000,
    isVisible: true,

    didInsertElement: function () {
        var self = this;

        //  HACK: this is here as a lesson about what not to do :)
        if (window.TESTING) {
            this.set('isVisible', false);
            return;
        }

        function calculateHeight($content) {
            var height = $content.height();
            var paddingTop = $content.css('padding-top').replace('px', '');
            var paddingBottom = $content.css('padding-bottom').replace('px', '');

            return (+height + (+paddingTop) + (+paddingBottom)) + 'px';
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

        // Reset the lefthand nagivation to match the height of #content
        var $content = $('#content');
        var $marketplaceNav = $('#marketplace-nav');
        var $embeddedContent = $('#embedded-dashboard-content');

        $marketplaceNav.height(calculateHeight($content));

        $('iframe.auto-height').iframeAutoHeight({
            debug: false,
            minHeight: 400,
            triggerFunctions: [
                onIframeTrigger
            ],
            callback: function (callbackObject) {
                // Reset the left hand navigation to match the height of #content
                $marketplaceNav.height(calculateHeight($content));
            }
        });

        $embeddedContent.load(function () {
            // Fire this in case the server redirected
            self.updateHashFromIframeLocation(this.contentWindow.location.pathname);

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
