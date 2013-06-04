Balanced.AddExistingMarketplaceView = Balanced.View.extend({
    templateName: 'marketplaces/_add_existing',
    tagName: 'form',
    formProperties: ['api_key'],

    secret: null,

    add: function () {
        var self = this;
        var secret = this.get('secret');
        if (!secret) {
            return;
        }
        var marketplace = Balanced.MarketplaceLite.create({
            uri: Balanced.Auth.get('user').get('marketplaces_uri'),
            secret: secret
        }).one('didCreate',function () {
            self.reset();
        }).on('becameInvalid', self.highlightErrorsFromAPIResponse);
        this.get('controller').send('addMarketplace', marketplace);
    },

    reset: function () {
        this.set('secret', null);
    }

});
