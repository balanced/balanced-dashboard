var Full = Balanced.Modals.FullModalMixin;
var Form = Balanced.Modals.FormModalMixin;

Balanced.Modals.MetaEditModalView = Balanced.ModalBaseView.extend(Full, Form, {
	elementId: "edit-transaction",
	templateName: 'modals/meta_edit_modal',
	title: "Meta information",
	submitButtonText: "Update",

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
		addNewField: function() {
			this.createNewField();
		},

		save: function() {
			var self = this;
			var metaFields = this.get("metaDictionary.fields");
			var notification = this.getNotificationController();
			var newMeta = {};

			this.get("metaDictionary").validate();

			if (this.get("metaDictionary.isValid")) {
				metaFields.forEach(function(metaField) {
					newMeta[metaField.key] = metaField.value || "";
				});

				this.set("model.meta", newMeta);

				this.save(this.get("model"))
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
