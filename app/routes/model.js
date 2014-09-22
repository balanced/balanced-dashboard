import TitleRoute from "./title";

var ModelRoute = TitleRoute.extend({
	model: function(params) {
		var marketplace = this.modelFor('marketplace');
		var modelObject = this.get('modelObject');
		var uri = this.get('marketplaceUri');

		return marketplace.then(function(marketplace) {
			var modelUri = Balanced.Utils.combineUri(marketplace.get(uri), params.item_id);
			return modelObject.find(modelUri);
		});
	}
});

export default ModelRoute;
