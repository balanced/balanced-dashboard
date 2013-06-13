Balanced.User = Balanced.Model.extend({
});

Balanced.User.reopenClass({
    deserialize: function (json) {
        json.marketplaces = json.marketplaces || [];
        json.marketplaces.sort(function (a, b) {
            if (a.name === b.name) {
                return 0;
            }
            return (a.name > b.name) ? 1 : -1;
        });
        json.marketplaces = _.map(json.marketplaces, function (marketplace) {
            return Balanced.Marketplace.find(marketplace.uri);
        });
    }
});

Balanced.Adapter.registerHostForType(Balanced.User, ENV.BALANCED.AUTH);
