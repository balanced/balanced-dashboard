var Full = Balanced.Modals.FullModalMixin;

Balanced.IntermediateStateBaseModalView = Balanced.ModalBaseView.extend(Full, {
	templateName: "register_flow/intermediate_state_modal",
	title: "Intermediate state",

	errorMessages: function() {
		return Balanced.ErrorMessagesCollection.create();
	}.property(),

	openNext: function() {
		var controller = this.get("container").lookup("controller:application");
		var args = _.toArray(arguments);
		args.unshift("openModal");
		controller.send.apply(controller, args);
	},

	isSaving: false,
	execute: function(callback) {
		var self = this;
		var errors = this.get("errorMessages");
		errors.clear();

		this.set("isSaving", true);

		return callback()
			.then(function() {
				self.close();
			}, function(response) {
				errors.populate(response);
			});
	},
});
