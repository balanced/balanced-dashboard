Balanced.MarketplaceCreditsRoute = Balanced.Route.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    return ENV.BALANCED.WWW + "/marketplaces/" + marketplace.get('id') + "/credits/" + params.credit_id + "?embedded=1";
  }
});
