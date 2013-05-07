require('app/models/store');

Balanced.User = Balanced.Model.extend({
});

Balanced.User.reopenClass({
  deserialize: function(json) {
    json.marketplaces = _.map(json.marketplaces, function(marketplace) {
      marketplace._type = "marketplaceLite";
      return Balanced.MarketplaceLite.create(marketplace);
    });
  },

  host: function(uri) {
    return ENV.BALANCED.AUTH;
  }
});
