Balanced.CardsRoute = Balanced.IframeRoute.extend({
    param: 'card_id',
    title: 'Activity',
    resource: 'cards',
    renderTemplate: function () {
        this.render('activity');
    }
});

Balanced.CardsCardRoute = Balanced.ShowResource.extend({
    param: 'card_id',
    title: 'Card',
    resource: 'cards'
});
