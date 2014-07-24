Balanced.Modals.EditTransactionModalView = Balanced.ModalBaseView.extend({
	classNameBindings: [":wide-modal", ":modal-overflow"],
	elementId: "edit-transaction",
	templateName: 'modals/edit_transaction_modal',
	title: "Edit info",

	actions: {
		save: function() {
			var self = this;
			var model = this.get("model");
			model
				.save()
				.then(function() {
					model.reload();
					self.get('controller').alert({
						reset: 5000,
						type: 'success',
						message: 'Your %@ has been updated.'.fmt(model.get("type_name").toLowerCase())
					});
					self.close();
				});
		}
	}
});

Balanced.Modals.EditTransactionModalView.reopenClass({
	open: function(model) {
		return this.create({
			model: model
		});
	}
});
