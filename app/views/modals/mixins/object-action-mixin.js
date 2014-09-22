import Ember from "ember";

var ObjectActionMixin = Ember.Mixin.create({
	isSaving: false,
	delete: function(model) {
		var self = this;
		this.set("isSaving", true);
		return model
			.delete()
			.then(function(savedModel) {
				self.set("isSaving", false);
				self.close();
				return Ember.RSVP.resolve(savedModel);
			}, function(errors) {
				self.set("isSaving", false);
				return Ember.RSVP.reject(errors);
			});
	},
	save: function(model) {
		var self = this;
		this.set("isSaving", true);
		return model
			.save()
			.then(function(savedModel) {
				self.set("isSaving", false);
				self.close();
				return Ember.RSVP.resolve(savedModel);
			}, function(errors) {
				self.set("isSaving", false);
				return Ember.RSVP.reject(errors);
			});
	}
});

export default ObjectActionMixin;
