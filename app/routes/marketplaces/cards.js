
Balanced.CardsRoute = Balanced.IframeRoute.extend({
    param: 'card_id',
    title: 'Cards',
    resource: 'cards'
});

Balanced.CardsCardRoute = Balanced.ShowResource.extend({
    param: 'card_id',
    title: 'Card',
    resource: 'cards'
});
