Balanced.LogsIndexRoute = Balanced.ControllerRoute.extend({
	pageTitle: 'Logs'
});

Balanced.LogsLogRoute = Balanced.TitleRoute.extend({
	title: 'Log',

	model: function(params) {
		var logUri = Balanced.Log.constructUri(params.item_id);
		return Balanced.Log.find(logUri);
	}
});
