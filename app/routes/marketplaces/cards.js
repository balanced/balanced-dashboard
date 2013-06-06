Balanced.CardsIndexRoute = Balanced.ShowResource.extend({
    param: 'card_id',
    title: 'Activity',
    resource: 'cards',
    renderTemplate: function () {
        this.render('marketplace/activity');
    }
});

Balanced.CardsCardRoute = Balanced.ShowResource.extend({
    param: 'card_id',
    title: 'Card',
    resource: 'cards'
});
