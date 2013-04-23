require('app/models/store');

Balanced.Credit = Balanced.Model.extend({
    marketplace: DS.belongsTo('Balanced.Marketplace'),

    embedded_iframe_url: function() {
        return ENV.BALANCED.WWW + "/marketplaces/" + this.get('marketplace').get('id') + "/credits/" + this.get('id') + "?embedded=1";
    }.property('id')
});

// TODO - a hack until finding credits actually works
Balanced.Credit.FIXTURES = [];