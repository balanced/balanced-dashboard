/*
	This view responds to the global openModal event. It knows how to instantiate
	and open modals.
*/
Balanced.ModalsContainerView = Ember.ContainerView.extend({
	didInsertElement: function() {
		var self = this;
		var route = Balanced.__container__.lookup("route:application");
		route.on("openModal", function(klass, attributes) {
			attributes = attributes || {};
			var view = klass.create(attributes);
			view.open(self);
		});
		this._super();
	},
});
