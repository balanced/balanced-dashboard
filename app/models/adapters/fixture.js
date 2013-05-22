Balanced.FixtureAdapter = Balanced.BaseAdapter.extend({
  initAdapter: function() {
    this.dataMap = {};
  },

  get: function(type, uri, success) {
    var json = this.dataMap[uri];
    success(json);
  },

  addFixture: function(json) {
    this.dataMap[json.uri] = json;
  },

  addFixtures: function(jsonArray) {
    _.each(jsonArray, _.bind(this.addFixture, this));
  }
});
