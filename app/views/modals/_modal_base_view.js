Balanced.Modals = {};

Balanced.ModalBaseView = Ember.View.extend({
	layoutName: "modals/base_modal_layout",
	classNames: "modal",

	reposition: function() {
		$(window).resize();
	},

	open: function(container) {
		return this.$().modal("show");
	},

	close: function() {
		return this.$().modal("hide");
	}
});

Balanced.Modals.WideModalMixin = Ember.Mixin.create({
	classNameBindings: [":wide-modal", ":modal-overflow"],
});

Balanced.Modals.FullModalMixin = Ember.Mixin.create({
	classNameBindings: [":modal-full"],
});

Balanced.Modals.ObjectSaveMixin = Ember.Mixin.create({
	isSaving: false,
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

Balanced.Modals.ValidateAndSaveMixin = Ember.Mixin.create({
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
					return Ember.RSVP.reject(errors);
				});
		} else {
			self.set("isSaving", false);
			return Ember.RSVP.reject();
		}
	}
});

Balanced.ModalBaseView.reopenClass({
	open: function(attributes) {
		return this.create(attributes);
	}
});

Balanced.ObjectCreatorModalBaseView = Balanced.ModalBaseView.extend({
	title: "Create an object",
	model: function() {
		return this.get("model_class").create();
	}.property("model_class"),

	isSaving: false,

	actions: {
		submit: function() {
			var self = this;

			var model = this.get("model");
			model.validate();
			if (model.get("isValid")) {
				self.set("isSaving", true);
				model.save().then(function(credit) {
					self.get('controller').transitionToRoute(credit.get('route_name'), credit);
					self.close();
				}).
				finally(function() {
					self.set("isSaving", false);
				});
			}
		}
	}
});

Balanced.Modals.ModalBaseFooter = Balanced.View.extend({
	classNameBindings: [":modal-footer"],
	templateName: "modals/modal_base_footer"
});
