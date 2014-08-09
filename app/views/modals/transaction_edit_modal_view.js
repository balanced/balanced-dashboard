var Wide = Balanced.Modals.WideModalMixin;
var Save = Balanced.Modals.ObjectActionMixin;

Balanced.Modals.TransactionEditModalView = Balanced.ModalBaseView.extend(Wide, Save, {
	elementId: "edit-transaction",
	templateName: 'modals/transaction_edit_modal',
	title: "Edit info",

	actions: {
		save: function() {
			var controller = this.get("controller.controllers.temporary_alerts");
			this.save(this.get("model"))
				.then(function(model) {
					var message = 'Your %@ has been updated.'.fmt(model.get("type_name").toLowerCase());
					model.reload();
					controller.alertSuccess(message).expires();
				});
		}
	}
});

Balanced.Modals.TransactionEditModalView.reopenClass({
	open: function(model) {
		return this.create({
			model: model
		});
	}
});
