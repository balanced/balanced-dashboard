require('app/models/store');

Balanced.Marketplace = Balanced.MarketplaceLite.extend({
    in_escrow: DS.attr('number')
});
