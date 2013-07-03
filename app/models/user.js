Balanced.User = Balanced.Model.extend({

    marketplace_lites: Balanced.Model.hasMany('Balanced.MarketplaceLite', 'marketplace_lites'),

    marketplaces: function() {
        var marketplaceLites = this.get('marketplace_lites').get('content');
        return _.map(marketplaceLites, function (marketplace) {
            return Balanced.Marketplace.find(marketplace.uri);
        });
    }.property('marketplace_lites'),

    gravatar: function () {
        var emailHash = this.get('email_hash');
        return Balanced.Utils.toGravatar(emailHash);
    }.property('email_hash'),


    deserialize: function (json) {
        this._super(json);

        json.marketplace_lites = json.marketplaces || [];
        delete json.marketplaces;

        json.marketplace_lites.sort(function (a, b) {
            if (a.name === b.name) {
                return 0;
            }
            return (a.name > b.name) ? 1 : -1;
        });
    }
});

Balanced.Adapter.registerHostForType(Balanced.User, ENV.BALANCED.AUTH);
