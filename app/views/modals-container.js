import Ember from "ember";

var ModalsContainerView = Ember.ContainerView.extend({
	didInsertElement: function() {
		this.get("controller").registerContainer(this);
	},
});

export default ModalsContainerView;
