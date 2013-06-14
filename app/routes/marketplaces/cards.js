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
    resource: 'cards',
    setupController: function(controller, model) {
        this._super(controller, model);
        try {
            this.controllerFor('account').set('content', model);
        } catch (e) {
            //  if not nested under account, this will not work
        }
    }
});
