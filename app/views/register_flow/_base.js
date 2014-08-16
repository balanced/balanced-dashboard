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

Balanced.IntermediateStateBaseModalView = Balanced.RegisterFlowBaseModal.extend({
	templateName: "register_flow/intermediate_state_modal",
	title: "Intermediate state",

	lookupController: function(name) {
		return Balanced.__container__.lookup(name);
	},

	errorMessages: function() {
		return Balanced.ErrorMessagesCollection.create();
	}.property(),

	isSaving: false,
	execute: function(callback) {
		var self = this;
		var errors = this.get("errorMessages");
		errors.clear();

		this.set("isSaving", true);

		return callback()
			.then(function(response) {
				self.set("isSaving", false);
				self.close();
				return Ember.RSVP.resolve(response);
			}, function(response) {
				self.set("isSaving", false);
				errors.populate(response);
				return Ember.RSVP.reject();
			});
	},
});

Balanced.IntermediateStateBaseModalView.reopenClass({
	open: function(attributes) {
		var view = this.create(attributes);
		view.send("save");
		return view;
	},
});
