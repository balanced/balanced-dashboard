import Ember from "ember";

var OpenNextModalMixin = Ember.Mixin.create({
	openNext: function() {
		var container = this.get("container");
		var applicationController = container.lookup("controller:application");
		var args = _.toArray(arguments);
		args.unshift("openModal");
		return applicationController.send.apply(applicationController, args);
	},
});

export default OpenNextModalMixin;
