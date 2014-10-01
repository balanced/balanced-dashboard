import Wide from "balanced-dashboard/views/modals/mixins/wide-modal-mixin";
import Save from "balanced-dashboard/views/modals/mixins/object-action-mixin";
import ModalBaseView from "./modal-base";

var TransactionEditModalView = ModalBaseView.extend(Wide, Save, {
	elementId: "edit-transaction",
	templateName: 'modals/transaction-edit-modal',
	title: "Edit info",

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

TransactionEditModalView.reopenClass({
	open: function(model) {
		return this.create({
			model: model
		});
	}
});

export default TransactionEditModalView;
