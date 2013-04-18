require('app/models/store');

Balanced.Marketplace = Balanced.Model.extend({
    name: DS.attr('string'),
    in_escrow: DS.attr('number'),
    uri: DS.attr('string')
});
