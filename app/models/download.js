Balanced.Download = Balanced.Model.extend({
    creation_uri: function () {
        // TODO: We're appending the marketplace_uri here. This should be a
        // global once kleinsch merges his handler...
        var m = new RegExp('/marketplaces/([\\w-]+)').exec(window.location.hash);
        if (m && m.length >= 2) {
            return '/downloads?marketplace=' + m[1];
        }
        return null;
    },
    _propertiesMap: function () {
        return {
            email_address: this.email_address,
            uri: this.uri
        };
    }
});


Balanced.Download.reopenClass({
});


Balanced.Adapter.registerHostForType(Balanced.Download, ENV.BALANCED.WWW);
