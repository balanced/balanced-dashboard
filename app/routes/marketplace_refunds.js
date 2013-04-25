Balanced.MarketplaceRefundsRoute = Balanced.Route.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    return ENV.BALANCED.WWW + "/marketplaces/" + marketplace.get('id') + "/refunds/" + params.refund_id + "?embedded=1";
  }
});
