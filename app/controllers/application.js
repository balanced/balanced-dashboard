Balanced.ApplicationController = Ember.Controller.extend({
  iframeLinkClicked: function(context) {
    var transitionToDest = context.url;
    if(transitionToDest.indexOf('?') != -1) {
      transitionToDest = transitionToDest.substring(0, transitionToDest.indexOf('?'));
    }

    if(transitionToDest !== '#') {
      console.log("Detected link click - going to " + transitionToDest);
      window.location.hash = "#" + transitionToDest;
    }
  }
});
