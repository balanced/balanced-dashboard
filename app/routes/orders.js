import TitleRoute from "./title";

var OrdersRoute = TitleRoute.extend({
	title: 'Order',

	model: function(params) {
		var Order = this.get("container").lookupFactory("model:order");
		var marketplace = this.modelFor('marketplace');
		var orderUri = Order.constructUri(params.item_id);
		return Order.find(orderUri);
	}
});

export default OrdersRoute;
