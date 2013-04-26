require('app/models/store');

Balanced.User = Balanced.Model.extend({
  email_address: DS.attr('string'),
  marketplaces: DS.hasMany('Balanced.MarketplaceLite')
});
