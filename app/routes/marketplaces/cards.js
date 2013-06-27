Balanced.CardsIndexRoute = Balanced.AuthRoute.extend({
    redirect: function() {
        this.transitionTo('activity.funding_instruments');
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
