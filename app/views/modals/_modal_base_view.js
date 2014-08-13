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
		var element = this.$();
		if (element) {
			return element.modal("hide");
		}
	}
});

Balanced.ModalBaseView.reopenClass({
	open: function(attributes) {
		return this.create(attributes);
	}
});

Balanced.Modals.FormModalMixin = Ember.Mixin.create({
	layoutName: "modals/form_modal_layout",
});

Balanced.Modals.WideModalMixin = Ember.Mixin.create({
	classNameBindings: [":wide-modal", ":modal-overflow"],
});

Balanced.Modals.FullModalMixin = Ember.Mixin.create({
	classNameBindings: [":half-screen-modal"],
});

Balanced.Modals.DisplayModelErrorsModalMixin = Ember.Mixin.create({
	updateErrorsBar: function() {
		var controller = this.get("container").lookup("controller:modal_notification_center");
		controller.clear();
		this.get("model.validationErrors.allMessages").forEach(function(error) {
			if (Ember.isBlank(error[0])) {
				controller.alertError(error[1]);
			}
		});

	}.observes("model.validationErrors.allMessages"),
});

Balanced.Modals.OpenNextModalMixin = Ember.Mixin.create({
	openNext: function() {
		this.close();
		var controller = this.get("container").lookup("controller:application");
		var args = _.toArray(arguments);
		args.unshift("openModal");
		return controller.send.apply(controller, args);
	},
});

Balanced.Modals.ObjectActionMixin = Ember.Mixin.create({
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

Balanced.Modals.ObjectValidateAndSaveMixin = Ember.Mixin.create({
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
