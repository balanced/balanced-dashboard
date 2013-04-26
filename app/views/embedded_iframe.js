Balanced.EmbeddedIframeView = Balanced.View.extend({
  templateName: 'embedded_iframe',

  didInsertElement: function() {
    $('iframe').iframeAutoHeight({debug: true});
    $('iframe.auto-height').iframeAutoHeight({minHeight: 400});
  }
});

Balanced.update_hash_from_iframe_location = function(iframePath) {
  var transitionToDest = iframePath;
  if(transitionToDest.indexOf('?') !== -1) {
    transitionToDest = transitionToDest.substring(0, transitionToDest.indexOf('?'));
  }

  if(transitionToDest !== '#') {
    window.location.hash = "#" + transitionToDest;
  }
}

// can't attach the onload using jquery, so have to statically define this here so it can be referenced in the HTML template
Balanced.embedded_iframe_loaded = function(location) {
  // Fire this in case the server redirected
  Balanced.update_hash_from_iframe_location(location.pathname);

  // Add a handler to links so we can change the page BEFORE the page loads
  $("#embedded-dashboard-content").contents().find("a").click(function(event) {
    var addressValue = $(this).attr("href");
    Balanced.update_hash_from_iframe_location(addressValue);
  });
};
