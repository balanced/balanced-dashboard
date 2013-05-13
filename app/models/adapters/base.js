Balanced.BaseAdapter = Ember.Object.extend({
  init: function() {
    if(this.initAdapter) {
      this.initAdapter();
    }
  },

  get: function(uri, success) {
    Ember.assert("Your adapter should override get", false);
  }
});
