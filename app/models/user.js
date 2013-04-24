require('app/models/store');

Balanced.User = Balanced.Model.extend({
  name: DS.attr('string'),
  marketplaces: DS.hasMany('Balanced.Marketplace')
});
