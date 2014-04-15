Balanced.OrdersRoute = Balanced.TitleRoute.extend({
	title: 'Order',

	model: function(params) {
		var marketplace = this.modelFor('marketplace');
		var orderUri = Balanced.Order.constructUri(params.item_id);
		return Balanced.Order.find(orderUri);
	}
});
