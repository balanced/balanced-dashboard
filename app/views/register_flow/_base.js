var Full = Balanced.Modals.FullModalMixin;
var OpenNext = Balanced.Modals.OpenNextModalMixin;
var Form = Balanced.Modals.FormModalMixin;

Balanced.RegisterFlowBaseModal = Balanced.ModalBaseView.extend(Full, Form, OpenNext, {});

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
