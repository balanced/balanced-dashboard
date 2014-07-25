var Wide = Balanced.Modals.WideModalMixin;
var Save = Balanced.Modals.ObjectSaveMixin;

Balanced.Modals.TransactionEditModalView = Balanced.ModalBaseView.extend(Wide, Save, {
	elementId: "edit-transaction",
	templateName: 'modals/transaction_edit_modal',
	title: "Edit info",

	actions: {
		save: function() {
			var controller = this.get("controller");
			this.save(this.get("model"))
				.then(function(model) {
					model.reload();
					controller.alert({
						reset: 5000,
						type: 'success',
						message: 'Your %@ has been updated.'.fmt(model.get("type_name").toLowerCase())
					});
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
