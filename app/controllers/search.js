Balanced.SearchController = Balanced.ObjectController.extend({
  needs: ["marketplace"],

  search: '',

  query: function() {
    var query = this.get('search');

    var marketplaceId = this.get('controllers').get('marketplace').get('id');

    if(marketplaceId === undefined) {
      // TODO - For testing only - TAKE THIS OUT BEFORE MERGING
      marketplaceId = 'TEST-MP5m04ORxNlNDm1bB7nkcgSY';
    }

    this.set('content', Balanced.SearchQuery.search(marketplaceId, query));
  }
});
