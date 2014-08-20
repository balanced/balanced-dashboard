var Full = Balanced.Modals.FullModalMixin;
var OpenNext = Balanced.Modals.OpenNextModalMixin;
var Form = Balanced.Modals.FormModalMixin;
var DisplayModelErrors = Balanced.Modals.DisplayModelErrorsModalMixin;

Balanced.RegisterFlowBaseModal = Balanced.ModalBaseView.extend(Full, Form, OpenNext, DisplayModelErrors, {
	open: function() {
		var self = this;
		var $el = this._super().undelegate('[data-dismiss="modal"]', 'click.dismiss.modal');
		$el.delegate('[data-dismiss="modal"]', 'click.dismiss.modal', function() {
			self.close();
			self.openConfirmCloseModal();
		});
		return $el;
	},

	alertSuccess: function(message) {
		message = new Ember.Handlebars.SafeString(message.fmt(apiKeySecret));
		this.getModalNotificationController().alertSuccess(message);
	},
	openConfirmCloseModal: function() {
		var self = this;
		this.openNext(Balanced.ConfirmCloseRegistrationModalView, {
			confirmMessage: this.get("confirmMessage"),
			previousModal: self
		});
	},
	getNotificationController: function() {
		return this.get("container").lookup("controller:notification_center");
	},
	getModalNotificationController: function() {
		return this.get("container").lookup("controller:modal_notification_center");
	},
});
