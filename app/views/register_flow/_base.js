var Full = Balanced.Modals.FullModalMixin;

Balanced.IntermediateStateBaseModalView = Balanced.ModalBaseView.extend(Full, {
	templateName: "register_flow/intermediate_state_modal",
	title: "Intermediate state",

	errorMessages: function() {
		return Balanced.ErrorMessagesCollection.create();
	}.property(),
});
