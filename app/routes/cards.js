Balanced.CardsIndexRoute = Balanced.AuthRoute.extend({
    redirect: function () {
        this.transitionTo('activity.funding_instruments');
    }
});

Balanced.CardRoute = Balanced.AuthRoute.extend({
    page_title: function (route, set_title) {
        var card = route.controller.content;
        return Balanced.Utils.loadSetTitle(card, set_title, function () {
            return 'Card: loading ...'; 
        }, function () {
            return 'Card: {0} ({1} {2})'.format(
                card.get('name'), 
                card.get('last_four'), 
                Balanced.Utils.toTitleCase(card.get('brand'))
            );
        });
    },

    model: function (params) {
        var marketplace = this.modelFor('marketplace');
        return marketplace.then(function (marketplace) {
            var cardUri = marketplace.get('cards_uri') + '/' + params.card_id;
            return Balanced.Card.find(cardUri);
        });
    }
});
