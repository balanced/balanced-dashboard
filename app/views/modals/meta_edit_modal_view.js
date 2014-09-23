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
			var metaDictionary = this.get("metaDictionary");
			var notification = this.getNotificationController();
			var modalNotification = this.getModalNotificationController();

			notification.clearAlerts();
			modalNotification.clearAlerts();

			metaDictionary.save()
				.then(function(model) {
					var message = 'Your %@ has been updated.'.fmt(model.get("type_name").toLowerCase());
					model.reload();
					notification.alertSuccess(message, {
						expire: true
					});
				}, function() {
					metaDictionary.get("validationErrors.fields.fullMessages").forEach(function(message) {
						modalNotification.alertError(message);
					});
				});
		}
	}
});

Balanced.Modals.MetaEditModalView.reopenClass({
	open: function(model, metaFields) {
		return this.create({
			metaDictionary: Balanced.MetaDictionary.create({
				transaction: model,
				fields: Ember.copy(metaFields, true)
			})
		});
	}
});
