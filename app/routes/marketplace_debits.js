Balanced.MarketplaceDebitsRoute = Balanced.Route.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    return marketplace.get('web_uri') + "/debits/" + params.debit_id + "?embedded=1";
  }
});
