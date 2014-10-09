import ModalBaseView from "./modal-base";

var CallbackDeleteModalView = ModalBaseView.extend({
	templateName: "modals/callback-delete-modal",
	title: 'Delete webhook',
	elementId: 'delete-callback',
	classNames: ["wide-modal"],
	description: 'Are you sure you want to delete this endpoint? No future webhooks will be sent to this URL.',

	isSaving: false,
	actions: {
		submit: function(callback) {
			var self = this;
			self.set("isSaving", true);
			callback.delete()
				.then(function() {
					var callbacks = self.get("container").lookup("controller:marketplace").get("callbacks");
					callbacks.reload();
				})
				.finally(function() {
					self.set("isSaving", false);
					self.close();
				});
		}
	}
});

CallbackDeleteModalView.reopenClass({
	open: function(callback) {
		return this.create({
			callback: callback
		});
	}
});

export default CallbackDeleteModalView;
