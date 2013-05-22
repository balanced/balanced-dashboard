Balanced.EmbeddedIframeView = Balanced.View.extend({
    templateName: 'embedded_iframe',
    resizer: null,

    didInsertElement: function () {
        function calculateHeight($content) {
            var height = $content.height();
            var paddingTop = $content.css('padding-top').replace('px', '');
            return (+height + (+paddingTop)) + 'px';
        }

        function onIframeTrigger(resizeFunction, iframe) {
            if (this.resizer) {
                return;
            }
            this.resizer = setInterval(function() {
                resizeFunction(iframe);
            }, 1000);
        }

        // Reset the lefthand nagivation to match the height of #content
        var $content = $('#content');
        var $marketplaceNav = $('#marketplace-nav');
        var $embeddedContent = $('#embedded-dashboard-content');

        $marketplaceNav.height(calculateHeight($content));

        $('iframe.auto-height').iframeAutoHeight({
            debug: false, //ENV.BALANCED.DEBUG,
            minHeight: 400,
            triggerFunctions: [
                onIframeTrigger
            ],
            callback: function(callbackObject) {
                // Reset the left hand navigation to match the height of #content
                $marketplaceNav.height(calculateHeight($content));
            }
        });

        var _this = this;
        $embeddedContent.load(function () {
            // Fire this in case the server redirected
            _this.updateHashFromIframeLocation(this.contentWindow.location.pathname);

            // Add a handler to links so we can change the page BEFORE the page loads
            $embeddedContent.contents().find('a').click(function (event) {
                var addressValue = $(this).attr('href');
                _this.updateHashFromIframeLocation(addressValue);
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

        if (transitionToDest !== '#') {
            window.location.hash = '#' + transitionToDest;
        }
    },

    willDestroyElement: function() {
        if (this.resizer) {
            clearInterval(this.resizer);
        }
        this.resizer = null;
    }
});
