Balanced.Marketplace = Balanced.MarketplaceLite.extend({

});

Balanced.Marketplace.find = function(uri) {
    var marketplace = Balanced.Marketplace.create({uri: uri});
    Balanced.Model.ajax(ENV.BALANCED.API + uri, "GET").then(function(json) {
        marketplace.setProperties(json);
    });
    return marketplace;
};

Balanced.Marketplace.constructUri = function(id) {
    return "/v1/marketplaces/" + id;
};