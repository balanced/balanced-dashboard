Balanced.EmbeddedIframeView = Balanced.View.extend({
  templateName: 'embedded_iframe',

  didInsertElement: function(evt) {
  }
});

Balanced.embedded_iframe_loaded = function() {
  $("#embedded_dashboard_content").contents().find("a").click(function() {
    var addressValue = $(this).attr("href");
    console.log("iframe link clicked - going to " + addressValue);
  });
};
