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

	onModelSaved: function() {
		var typeName = this.get("model.type_name");
		var message = 'Your %@ has been updated.'.fmt(typeName.toLowerCase());
		this.getNotificationController().alertSuccess(message, {
			expire: true
		});
		this.get("originalModel").reload();
		this.close();
	},

	actions: {
		save: function() {
			this.validateAndSaveModel();
		}
	}
});

EditDescriptionModalView.reopenClass({
	open: function(model) {
		return this.create({
			originalModel: model,
			model: model.copy()
		});
	}
});

export default EditDescriptionModalView;
