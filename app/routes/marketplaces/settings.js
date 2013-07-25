Balanced.MarketplaceSettingsRoute = Balanced.AuthRoute.extend({
    page_title: 'Settings',

    model: function (params) {
        return this.modelFor('marketplace');
    }
});
