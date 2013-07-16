Balanced.AddTestMarketplaceView = Balanced.BaseFormView.extend({
    templateName: 'marketplaces/_add_test',
    tagName: 'form',
    formProperties: ['name'],

    name: null,

    add: function () {
        var self = this;
        var marketplaceName = this.get('name');
        if (!marketplaceName) {
            return;
        }
        var marketplace = Balanced.UserMarketplace.create({
            uri: Balanced.Auth.get('user').get('marketplaces_uri'),
            name: marketplaceName
        }).one('didCreate',function () {
            self.reset();
        }).on('becameInvalid', self.highlightErrorsFromAPIResponse);
        this.get('controller').send('addMarketplace', marketplace);
    },

    reset: function () {
        this.set('name', null);
    }

});
