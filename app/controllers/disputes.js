import Ember from "ember";

var DisputeController = Ember.ObjectController.extend(Ember.Evented, {
	needs: ['marketplace']
});

export default DisputeController;
