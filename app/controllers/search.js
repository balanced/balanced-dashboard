Balanced.SearchController = Balanced.ObjectController.extend({
  needs: ["marketplace"],

  search: '',

  query: function() {
    var query = this.get('search');

    // TODO - use the real marketplace
    var uri = '/v1/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/search?q=' + query + '&limit=10&offset=0';
    var _this = this;
    var searchResults = Balanced.SearchQuery.find(uri).then(function(searchResults) {
        _this.set('content', searchResults);
    });
  }
});
