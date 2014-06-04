Balanced.LogsRoute = Balanced.ControllerRoute.extend({
	pageTitle: 'Logs'
});

Balanced.LogRoute = Balanced.TitleRoute.extend({
	title: 'Log',

	model: function(params) {
		var logUri = Balanced.Log.constructUri(params.item_id);
		return Balanced.Log.find(logUri);
	}
});
