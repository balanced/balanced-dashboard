Balanced.MarketplaceHoldsRoute = Balanced.Route.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    return ENV.BALANCED.WWW + "/marketplaces/" + marketplace.get('id') + "/holds/" + params.hold_id + "?embedded=1";
  }
});
