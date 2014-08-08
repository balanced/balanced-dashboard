Balanced.ModalsContainerView = Ember.ContainerView.extend({
	didInsertElement: function() {
		this.get("controller").registerContainer(this);
	},
});
