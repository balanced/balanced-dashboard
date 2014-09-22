import Ember from "ember";

var ObjectValidateAndSaveMixin = Ember.Mixin.create({
	isSaving: false,
	save: function(model) {
		var self = this;
		this.set("isSaving", true);
		model.validate();
		if (model.get("isValid")) {
			return model.save()
				.then(function(savedModel) {
					self.set("isSaving", false);
					self.close();
					return Ember.RSVP.resolve(savedModel);
				}, function(errors) {
					self.set("isSaving", false);
					return Ember.RSVP.reject(errors);
				});
		} else {
			self.set("isSaving", false);
			return Ember.RSVP.reject();
		}
	}
});

export default ObjectValidateAndSaveMixin;
