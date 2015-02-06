import Ember from "ember";
import ModalBaseView from "./modal-base";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";
import Full from "balanced-dashboard/views/modals/mixins/full-modal-mixin";
import Save from "balanced-dashboard/views/modals/mixins/object-action-mixin";
import Utils from "balanced-dashboard/lib/utils";

var EditCustomerInfoModalView = ModalBaseView.extend(Full, Form, Save, {
	templateName: 'modals/customer-info-modal',
	elementId: "edit-customer-info",
	title: function() {
		var subject = (this.get("marketplaceOwner")) ? "owner": "customer";
		return "Edit %@ information".fmt(subject);
	}.property("marketplaceOwner"),

	cancelButtonText: "Cancel",
	submitButtonText: "Edit",

	marketplaceOwner: false,

	onModelSaved: function() {
		this.getNotificationController().alertSuccess('Your customer has been saved.', {
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

EditCustomerInfoModalView.reopenClass({
	open: function(model) {
		return this.create({
			originalModel: model,
			model: model.copy()
		});
	}
});

export default EditCustomerInfoModalView;
