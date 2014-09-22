import TitleRoute from "./title";
import Log from "../models/log";

var LogRoute = TitleRoute.extend({
	title: 'Log',

	model: function(params) {
		var logUri = Log.constructUri(params.item_id);
		return Balanced.Log.find(logUri);
	}
});

export default LogRoute;
