Balanced.EmbeddedIframeView = Balanced.View.extend({
  templateName: 'embedded_iframe',

  didInsertElement: function() {
    $('iframe').iframeAutoHeight({debug: true});
    $('iframe.auto-height').iframeAutoHeight({minHeight: 400});
  }
});

// can't attach the onload using jquery, so have to statically define this here so it can be referenced in the HTML template
Balanced.embedded_iframe_loaded = function(location) {
  // Fire this in case the server redirected
  Ember.Instrumentation.instrument("iframe.urlChanged", {url: location.pathname});

  // Add a handler to links so we can change the page BEFORE the page loads
  $("#embedded-dashboard-content").contents().find("a").click(function(event) {
    var addressValue = $(this).attr("href");
    Ember.Instrumentation.instrument("iframe.urlChanged", {url: addressValue});
  });
};
