Balanced.OrdersRoute = Balanced.AuthRoute.extend({
	title: 'Orders',

	pageTitle: function(route, setTitle) {
		var order = route.controller.content;
		return Balanced.Utils.maybeDeferredLoading(order, setTitle, function() {
			return 'Order: loading ...';
		}, function() {
			return 'Order: %@'.fmt(order.get('page_title'));
		});
	},

	model: function(params) {
		var marketplace = this.modelFor('marketplace');
		var orderUri = Balanced.Order.constructUri(params.order_id);
		return Balanced.Order.find(orderUri);
	}
});
