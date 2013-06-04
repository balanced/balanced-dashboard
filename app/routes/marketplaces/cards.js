Balanced.CardsCardRoute = Balanced.AuthRoute.extend({
    model: function (params) {
        var marketplace = this.modelFor('marketplace');
        return marketplace.get('web_uri') + '/cards/' + params.card_id + Balanced.MigrationUtils.EMBEDDED_QUERY_APPEND;
    }
});

