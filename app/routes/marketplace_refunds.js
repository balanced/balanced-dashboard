Balanced.MarketplaceRefundsRoute = Balanced.AuthRoute.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    return marketplace.get('web_uri') + "/refunds/" + params.refund_id + "?embedded=1";
  }
});
