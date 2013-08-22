Balanced.EventsRoute = Balanced.AuthRoute.extend({
	title: 'Events',
	model: function (params) {
		var marketplace = this.modelFor('marketplace');
		return marketplace.then(function(marketplace) {
			var eventUri = Balanced.Utils.combineUri(marketplace.get('events_uri'), params.event_id);
			return Balanced.Event.find(eventUri);
		});
	}
});
