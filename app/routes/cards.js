Balanced.CardsIndexRoute = Balanced.AuthRoute.extend({
    redirect: function () {
        this.transitionTo('activity.funding_instruments');
    }
});

Balanced.CardRoute = Balanced.AuthRoute.extend({
    model: function (params) {
        var marketplace = this.modelFor('marketplace');
        return marketplace.then(function(marketplace) {
            var cardUri = marketplace.get('cards_uri') + '/' + params.card_id;
            return Balanced.Card.find(cardUri);
        });
    }
});
