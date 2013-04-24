Balanced.MarketplaceDebitsRoute = Balanced.Route.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    return ENV.BALANCED.WWW + "/marketplaces/" + marketplace.get('id') + "/debits/" + params.debit_id + "?embedded=1";
  }
});
