import Ember from "ember";
import ModalBaseView from "./modal-base";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";
import Full from "balanced-dashboard/views/modals/mixins/full-modal-mixin";
import Save from "balanced-dashboard/views/modals/mixins/object-action-mixin";
import Utils from "balanced-dashboard/lib/utils";

var EditCustomerInfoModalView = ModalBaseView.extend(Full, Form, Save, {
	templateName: 'modals/edit-customer-info',
	elementId: "edit-customer-info",
	title: function() {
		var subject = (this.get("marketplaceOwner")) ? "owner": "customer";
		return "Edit %@ information".fmt(subject);
	}.property("marketplaceOwner"),

	cancelButtonText: "Cancel",
	submitButtonText: "Edit",

	marketplaceOwner: false,

	actions: {
		save: function() {
			var controller = this.getNotificationController();
			this.save(this.get("model"))
				.then(function(model) {
					var message = 'Your %@ has been updated.'.fmt(model.get("type_name").toLowerCase());
					model.reload();
					controller.alertSuccess(message, {
						expire: true
					});
				});
		}
	}
});

EditCustomerInfoModalView.reopenClass({
	open: function(model) {
		return this.create({
			model: model
		});
	}
});

export default EditCustomerInfoModalView;
