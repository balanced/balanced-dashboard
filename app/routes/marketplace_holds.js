Balanced.MarketplaceHoldsRoute = Balanced.Route.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    return marketplace.get('web_uri') + "/holds/" + params.hold_id + "?embedded=1";
  }
});
