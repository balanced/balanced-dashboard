Balanced.APIKey = Balanced.Model.extend({

});
Balanced.APIKey.reopenClass({
    current: function () {
        var apiKey = Balanced.APIKey.create({
            uri: '/v1/api_keys'
        });

        Balanced.APIKey.find('/v1/api_keys').then(function (apiKeys) {
            var theKeys = _.filter(apiKeys.items, function (key) {
                if (key.secret !== null) {
                    return key;
                }
            });
            var theKey = theKeys.length ? theKeys[0] : apiKeys.items[0];
            apiKey._updateFromJson(theKey);
        });

        return apiKey;
    }
});
