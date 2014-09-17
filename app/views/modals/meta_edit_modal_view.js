var Full = Balanced.Modals.FullModalMixin;
var Form = Balanced.Modals.FormModalMixin;
var Save = Balanced.Modals.ObjectActionMixin;

Balanced.Modals.MetaEditModalView = Balanced.ModalBaseView.extend(Full, Form, Save, {
	elementId: "edit-transaction",
	templateName: 'modals/meta_edit_modal',
	title: "Meta information",
	submitButtonText: "Update",

	getNotificationController: function() {
		return this.get("container").lookup("controller:notification_center");
	},

	actions: {
		addNewField: function() {
			this.get("metaFields").push({
				key: "",
				value: ""
			});
			this.get("model").reload();
		},

		save: function() {
			var controller = this.getNotificationController();
			var newMeta = {};

			this.get("metaFields").forEach(function(metaField) {
				newMeta[metaField.key] = metaField.value;
			});

			this.set("model.meta", newMeta);

			this.save(this.get("model"))
				.then(function(model) {
					var message = 'Your %@ has been updated.'.fmt(model.get("type_name").toLowerCase());
					model.reload();
					controller.clearAlerts();
					controller.alertSuccess(message, {
						expire: true
					});
				});
		}
	}
});

Balanced.Modals.MetaEditModalView.reopenClass({
	open: function(model, metaFields) {
		return this.create({
			model: model,
			metaFields: metaFields
		});
	}
});
