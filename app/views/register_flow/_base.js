var Full = Balanced.Modals.FullModalMixin;
var OpenNext = Balanced.Modals.OpenNextModalMixin;
var Form = Balanced.Modals.FormModalMixin;

Balanced.RegisterFlowBaseModal = Balanced.ModalBaseView.extend(Full, Form, OpenNext, {
	staticBackdrop: true,

	open: function() {
		var self = this;
		var $el = this._super().undelegate('[data-dismiss="modal"]', 'click.dismiss.modal');

		$el.delegate('[data-dismiss="modal"]', 'click.dismiss.modal', function() {
			self.close();
			self.openConfirmCloseModal();
		});

		return $el;
	},

	trackEvent: function(message, attributes) {
		attributes = _.extend({
			email_address: Balanced.Auth.get("user.email_address")
		}, attributes);
		Balanced.Analytics.trackEvent(message, attributes);
	},

	isSaving: false,
	makeSaving: function() {
		var controller = this.getModalNotificationController();
		controller.clearAlerts();
		controller.alertWarning("Saving..", {
			name: "Saving"
		});

		this.set("isSaving", true);
		this.$(":input").attr("disabled", true);
	},
	unmakeSaving: function() {
		this.getModalNotificationController().clearNamedAlert("Saving");
		this.set("isSaving", false);

		if (this.get("element")) {
			this.$(":input").attr("disabled", false);
		}
	},

	clearAlerts: function(message) {
		this.getModalNotificationController().clearAlerts();
	},
	alertSuccess: function(message) {
		message = new Ember.Handlebars.SafeString(message);
		this.getModalNotificationController().alertSuccess(message);
	},
	alertError: function(message) {
		message = new Ember.Handlebars.SafeString(message);
		this.getModalNotificationController().alertError(message);
	},

	globalAlertSuccess: function(message) {
		this.getNotificationController().alertSuccess(message);
	},
	globalAlertError: function(message) {
		this.getNotificationController().alertError(message);
	},

	openConfirmCloseModal: function() {
		var self = this;
		this.openNext(Balanced.ConfirmCloseRegistrationModalView, {
			confirmMessage: this.get("confirmMessage"),
			previousModal: self
		});
	}
});
