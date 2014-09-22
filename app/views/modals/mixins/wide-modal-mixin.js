import Ember from "ember";

var WideModalMixin = Ember.Mixin.create({
	classNameBindings: [":wide-modal", ":modal-overflow"],
});

export default WideModalMixin;
