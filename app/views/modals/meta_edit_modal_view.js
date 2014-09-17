var Full = Balanced.Modals.FullModalMixin;
var Form = Balanced.Modals.FormModalMixin;
var Save = Balanced.Modals.ObjectActionMixin;

Balanced.Modals.MetaEditModalView = Balanced.ModalBaseView.extend(Full, Form, Save, {
	elementId: "edit-transaction",
	templateName: 'modals/meta_edit_modal',
	title: "Meta information",
	submitButtonText: "Update",

	init: function() {
		if (Ember.isEmpty(this.get("metaFields"))) {
			this.createNewField();
		}
		this._super();
	},

	getNotificationController: function() {
		return this.get("container").lookup("controller:notification_center");
	},

	createNewField: function() {
		this.get("metaFields").pushObject({
			key: "",
			value: ""
		});
	},

	actions: {
		addNewField: function() {
			this.createNewField();
		},

		save: function() {
			var controller = this.getNotificationController();
			var newMeta = {};

			this.get("metaFields").forEach(function(metaField) {
				if (!Ember.isBlank(metaField.key)) {
					newMeta[metaField.key] = metaField.value || "";
				}
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
			metaFields: Ember.copy(metaFields, true)
		});
	}
});
