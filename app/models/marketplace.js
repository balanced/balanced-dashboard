Balanced.Marketplace = Balanced.MarketplaceLite.extend({

});

Balanced.Marketplace.reopenClass({
  constructUri: function(id) {
      return "/v1/marketplaces/" + id;
  }
});
