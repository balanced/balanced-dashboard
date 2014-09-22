var Full = Balanced.Modals.FullModalMixin;
var Form = Balanced.Modals.FormModalMixin;
var Save = Balanced.Modals.ObjectActionMixin;

Balanced.Modals.MetaEditModalView = Balanced.ModalBaseView.extend(Full, Form, Save, {
	elementId: "edit-meta",
	templateName: 'modals/meta_edit_modal',
	title: "Edit meta information",
	submitButtonText: "Update",

	firstLabelText: "Key",
	secondLabelText: "Value",

	init: function() {
		if (Ember.isEmpty(this.get("metaDictionary.fields"))) {
			this.createNewField();
		}
		this._super();
	},

	createNewField: function() {
		this.get("metaDictionary.fields").pushObject({
			key: "",
			value: ""
		});
	},

	actions: {
		addField: function() {
			this.createNewField();
		},

		removeField: function(metaField) {
			var metaFields = this.get("metaDictionary.fields");
			metaFields.removeObject(metaField);
		},

		save: function() {
			var self = this;
			var metaFields = this.get("metaDictionary.fields");
			var notification = this.getNotificationController();
			var newMeta = {};

			self.get("metaDictionary").validate();

			if (self.get("metaDictionary.isValid")) {
				metaFields.forEach(function(metaField) {
					newMeta[metaField.key] = metaField.value || "";
				});

				self.set("model.meta", newMeta);

				self.save(self.get("model"))
					.then(function(model) {
						var message = 'Your %@ has been updated.'.fmt(model.get("type_name").toLowerCase());
						model.reload();
						notification.clearAlerts();
						notification.alertSuccess(message, {
							expire: true
						});
					});
			} else {
				var modalNotification = self.getModalNotificationController();
				modalNotification.clearAlerts();
				self.get("metaDictionary.validationErrors.fields.fullMessages").forEach(function(message) {
					modalNotification.alertError(message);
				});

				return Ember.RSVP.reject();
			}
		}
	}
});

Balanced.Modals.MetaEditModalView.reopenClass({
	open: function(model, metaFields) {
		return this.create({
			model: model,
			metaDictionary: Balanced.MetaDictionary.create({
				fields: Ember.copy(metaFields, true)
			})
		});
	}
});

Balanced.MetaDictionary = Ember.Object.extend(Ember.Validations, {
	validations: {
		fields: {
			keyPresent: {
				validator: function(obj, attr, value) {
					var error = obj.get('fields').any(function(item, index) {
						return Ember.isBlank(item.key);
					});

					if (error) {
						obj.get("validationErrors").add(attr, "keyPresent", null, "All keys must be present.");
					}
				}
			}
		}
	}
});
