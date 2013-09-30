Balanced.EventsRoute = Balanced.AuthRoute.extend({
	title: 'Events',

	pageTitle: function(route, setTitle) {
		var event = route.controller.content;
		return Balanced.Utils.maybeDeferredLoading(event, setTitle, function() {
			return 'Event: loading ...';
		}, function() {
			return 'Event: %@ #%@'.fmt(event.get('type'), event.get('id'));
		});
	},

	model: function(params) {
		var marketplace = this.modelFor('marketplace');
		return marketplace.then(function(marketplace) {
			var eventUri = Balanced.Utils.combineUri(marketplace.get('events_uri'), params.event_id);
			return Balanced.Event.find(eventUri);
		});
	}
});
