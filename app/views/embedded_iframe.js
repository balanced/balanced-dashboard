Balanced.EmbeddedIframeView = Balanced.View.extend({
  templateName: 'embedded_iframe',

  didInsertElement: function() {
    $('iframe').iframeAutoHeight({debug: true});
    $('iframe.auto-height').iframeAutoHeight({minHeight: 400});

    var _this = this;
    $("#embedded-dashboard-content").load(function() {
      // Fire this in case the server redirected
      _this.updateHashFromIframeLocation(this.contentWindow.location.pathname);

      // Add a handler to links so we can change the page BEFORE the page loads
      $("#embedded-dashboard-content").contents().find("a").click(function(event) {
        var addressValue = $(this).attr("href");
        _this.updateHashFromIframeLocation(addressValue);
      });
    })
  },

  updateHashFromIframeLocation: function(iframePath) {
    var transitionToDest = iframePath;
    if(transitionToDest.indexOf('?') !== -1) {
      transitionToDest = transitionToDest.substring(0, transitionToDest.indexOf('?'));
    }

    if(transitionToDest !== '#') {
      window.location.hash = "#" + transitionToDest;
    }
  }
});
