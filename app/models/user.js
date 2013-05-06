require('app/models/store');

Balanced.User = Balanced.Model.extend({
});

// TODO - take this substring out when we have relative URIs for users
Balanced.User.find = function(uri) {
  if(uri.indexOf("balancedpayments.com") !== -1) {
    uri = uri.substring(32);
  }

  return Balanced.Model.find.call(this, uri);
};

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
