import Utils from "balanced-dashboard/lib/utils";
import AuthRoute from "./auth";

var TitleRoute = AuthRoute.extend({
	title: 'Model',

	pageTitle: function(route, setTitle) {
		var model = route.controller.get("content");
		var title = route.get('title');

		return Utils.maybeDeferredLoading(model, setTitle, function() {
			return title + ': loading ...';
		}, function() {
			return title + ': %@'.fmt(model.get('page_title'));
		});
	}
});

export default TitleRoute;
