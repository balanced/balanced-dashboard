require('app/models/store');

Balanced.User = Balanced.Model.extend({
});

Balanced.User.find = function(uri) {
  // TODO - take this substring out when we have relative URIs for users
  if(uri.indexOf("balancedpayments.com") !== -1) {
    uri = uri.substring(32);
  }

  var user = Balanced.User.create({uri: uri});
  Balanced.Model.ajax(ENV.BALANCED.AUTH + uri, "GET").then(function(json) {
    json.marketplaces = _.map(json.marketplaces, function(marketplace) {
      marketplace._type = "marketplaceLite";
      return Balanced.MarketplaceLite.create(marketplace);
    });
    user.setProperties(json);
  });
  return user;
};
