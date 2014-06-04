var Computed = {
	isCategorySelected: function(category) {
		return Ember.computed.equal("controller.category", category);
	}
};

Balanced.ActivityPageNavigationView = Balanced.View.extend({
	templateName: "activity/page_navigation",
	isLoaded: Ember.computed.readOnly("results.isLoaded"),
	isLoading: Ember.computed.not("isLoaded"),

	isOrdersSelected: Ember.computed.equal("controller.category", "order"),
	isTransactionSelected: Ember.computed.equal("controller.category", "transaction"),
});
