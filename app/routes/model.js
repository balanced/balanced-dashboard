import TitleRoute from "./title";
import Utils from "balanced-dashboard/lib/utils";

var ModelRoute = TitleRoute.extend({
	model: function(params) {
		var marketplace = this.modelFor('marketplace');
		var modelObject = this.get('modelObject');
		var uri = this.get('marketplaceUri');

		return marketplace.then(function(marketplace) {
			var modelUri = Utils.combineUri(marketplace.get(uri), params.item_id);
			return modelObject.find(modelUri);
		});
	}
});

export default ModelRoute;
