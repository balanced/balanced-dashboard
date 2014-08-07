Balanced.ModalsContainerView = Ember.ContainerView.extend({
	didInsertElement: function() {
		this.get("controller").registerContainer(this);
	},
	open: function(klass, attributes) {
		var view = klass.open.apply(klass, attributes);
		var self = this;
		Ember.run(function() {
			self.pushObject(view);
		});
		view.open(this);
	}
});
