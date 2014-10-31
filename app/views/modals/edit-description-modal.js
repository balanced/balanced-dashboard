import Save from "balanced-dashboard/views/modals/mixins/object-action-mixin";
import ModalBaseView from "./modal-base";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";
import Full from "balanced-dashboard/views/modals/mixins/full-modal-mixin";

var EditDescriptionModalView = ModalBaseView.extend(Full, Form, Save, {
	elementId: "edit-description",
	templateName: 'modals/edit-description-modal',
	title: "Edit description",
	cancelButtonText: "Cancel",
	submitButtonText: "Edit",

	actions: {
		save: function() {
			var notification = this.getNotificationController();
			this.save(this.get("model"))
				.then(function(model) {
					var message = 'Your %@ has been updated.'.fmt(model.get("type_name").toLowerCase());
					model.reload();
					notification.clearAlerts();
					notification.alertSuccess(message, {
						expire: true
					});
				});
		}
	}
});

EditDescriptionModalView.reopenClass({
	open: function(model) {
		return this.create({
			model: model
		});
	}
});

export default EditDescriptionModalView;
