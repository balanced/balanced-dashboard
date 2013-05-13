Balanced.BaseAdapter = Ember.Object.extend({
  init: function() {
    if(this.initAdapter) {
      this.initAdapter();
    }
  },

  get: function(type, uri, success) {
    Ember.assert("Your adapter should override get", false);
  }
});
