import Ember from "ember";

var OpenNextModalMixin = Ember.Mixin.create({
	openNext: function() {
		var controller = this.container.lookup("controller:application");
		var args = _.toArray(arguments);
		args.unshift("openModal");
		return controller.send.apply(controller, args);
	},
});

export default OpenNextModalMixin;
