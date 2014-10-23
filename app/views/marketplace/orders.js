var MarketplaceOrdersView = Ember.View.extend({
	layoutName: "marketplace/payments-layout",
	templateName: "marketplace/orders",
	didInsertElement: function () {
		$('#content, #content > div.ember-view:last-child').height("100%");
	}
});

export default MarketplaceOrdersView;
