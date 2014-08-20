var Full = Balanced.Modals.FullModalMixin;
var OpenNext = Balanced.Modals.OpenNextModalMixin;
var Form = Balanced.Modals.FormModalMixin;
var DisplayModelErrors = Balanced.Modals.DisplayModelErrorsModalMixin;

Balanced.RegisterFlowBaseModal = Balanced.ModalBaseView.extend(Full, Form, OpenNext, DisplayModelErrors, {
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
		this.getModalNotificationController().alertWarning("Saving...", {
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

	alertSuccess: function(message) {
		message = new Ember.Handlebars.SafeString(message);
		this.getModalNotificationController().alertSuccess(message);
	},
	alertError: function(message) {
		message = new Ember.Handlebars.SafeString(message);
		this.getModalNotificationController().alertError(message);
	},

	alertServerError: function(response) {
		if (response.description) {
			this.alertError(response.description);
		}
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
	},
	getNotificationController: function() {
		return this.get("container").lookup("controller:notification_center");
	},
	getModalNotificationController: function() {
		return this.get("container").lookup("controller:modal_notification_center");
	}
});
