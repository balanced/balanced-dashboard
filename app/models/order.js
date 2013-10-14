Balanced.Order = Balanced.Model.extend({
	uri: '/orders',

	page_title: function() {
		return this.get('description') || this.get('id');
	}.property('description', 'id')
});

Balanced.TypeMappings.addTypeMapping('order', 'Balanced.Order');
