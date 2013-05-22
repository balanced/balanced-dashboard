Balanced.User = Balanced.Model.extend({
});

Balanced.User.reopenClass({
    deserialize: function (json) {
        json.marketplaces.sort(function (a, b) {
            if (a.name === b.name) {
                return 0;
            }
            return (a.name > b.name) ? 1 : -1;
        });
        json.marketplaces = _.map(json.marketplaces, function (marketplace) {
            marketplace._type = "marketplaceLite";
            return Balanced.MarketplaceLite.create(marketplace);
        });
    }
});

Balanced.Adapter.registerHostForType(Balanced.User, ENV.BALANCED.AUTH);
