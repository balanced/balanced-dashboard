Balanced.LogsIndexRoute = Balanced.AuthRoute.extend({
	pageTitle: 'Logs',

	setupController: function(controller, model) {
		controller.send('reload');
	}
});

Balanced.LogsLogRoute = Balanced.AuthRoute.extend({
	pageTitle: function(route, setTitle) {
		var log = route.controller.content;
		return Balanced.Utils.maybeDeferredLoading(log, setTitle, function() {
			return 'Log: loading ...';
		}, function() {
			return 'Log: %@ %@'.fmt(log.get('message.request.method'), log.get('short_url'));
		});
	},

	model: function(params) {
		var logUri = Balanced.Log.constructUri(params.log_id);
		return Balanced.Log.find(logUri);
	}
});
