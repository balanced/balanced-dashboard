Balanced.Marketplace = Balanced.MarketplaceLite.extend({
  credits: Balanced.Model.hasMany('Balanced.Credit', 'credits_uri'),
  debits: Balanced.Model.hasMany('Balanced.Debit', 'debits_uri'),
  refunds: Balanced.Model.hasMany('Balanced.Refund', 'refunds_uri'),
  holds: Balanced.Model.hasMany('Balanced.Hold', 'holds_uri')
});

Balanced.Marketplace.reopenClass({
  constructUri: function(id) {
      return "/v1/marketplaces/" + id;
  }
});
