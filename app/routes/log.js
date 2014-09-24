import TitleRoute from "./title";

var LogRoute = TitleRoute.extend({
	title: 'Log',

	model: function(params) {
		var Log = this.get("container").lookupFactory("model:log");
		var logUri = Log.constructUri(params.item_id);
		return Log.find(logUri);
	}
});

export default LogRoute;
