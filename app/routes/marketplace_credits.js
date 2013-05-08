Balanced.MarketplaceCreditsRoute = Balanced.AuthRoute.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    return marketplace.get('web_uri') + "/credits/" + params.credit_id + "?embedded=1";
  }
});
