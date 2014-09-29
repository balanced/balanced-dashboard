import Ember from "ember";

var FullModalMixin = Ember.Mixin.create({
	layoutName: "modals/full-modal-layout",
	classNameBindings: [":half-screen-modal"],
});

export default FullModalMixin;
