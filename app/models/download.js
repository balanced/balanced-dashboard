Balanced.Download = Balanced.Model.extend({
    _propertiesMap: function () {
        return {
            email_address: this.email_address,
            uri: this.uri
        };
    },

    // have to override the URI for create, since the uri property of the JSON is the search URI
    _createUri: function () {
        return '/downloads';
    }
});

Balanced.Adapter.registerHostForType(Balanced.Download, ENV.BALANCED.WWW);
