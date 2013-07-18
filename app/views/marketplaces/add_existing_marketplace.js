Balanced.AddExistingMarketplaceView = Balanced.View.extend({
    templateName: 'marketplaces/_add_existing',
    tagName: 'form',

    secret: null,

    isSubmitting: false,

    add: function () {
        if (this.get('isSubmitting')) {
            return;
        }
        this.set('isSubmitting', true);

        var self = this;
        var secret = this.get('secret');
        if (!secret) {
            self.set('isSubmitting', false);
            return;
        }
        var marketplace = Balanced.UserMarketplace.create({
            uri: Balanced.Auth.get('user').get('marketplaces_uri'),
            secret: secret
        });

        marketplace.create().then(function () {
            self.set('isSubmitting', false);
            self.set('secret', null);
            Balanced.Auth.get('user').refresh();
        }, function () {
            self.set('isSubmitting', false);
        });
    }
});
