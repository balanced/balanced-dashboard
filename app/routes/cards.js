Balanced.CardsIndexRoute = Balanced.AuthRoute.extend({
	redirect: function() {
		this.transitionTo('activity.funding_instruments', this.modelFor('marketplace'));
	}
});

Balanced.CardsRoute = Balanced.AuthRoute.extend({
	pageTitle: function(route, setTitle) {
		var card = route.controller.content;
		return Balanced.Utils.maybeDeferredLoading(card, setTitle, function() {
			return 'Card: loading ...';
		}, function() {
			return 'Card: %@'.fmt(card.get('displayName'));
		});
	},

	model: function(params) {
		var marketplace = this.modelFor('marketplace');
		return marketplace.then(function(marketplace) {
			var cardUri = Balanced.Utils.combineUri(marketplace.get('cards_uri'), params.card_id);
			return Balanced.Card.find(cardUri);
		});
	},

	setupController: function(controller, model) {
		this._super(controller, model);
		controller.send('reload');
	}
});
