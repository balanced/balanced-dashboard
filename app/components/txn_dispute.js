Balanced.TxnDisputeComponent = Ember.Component.extend({
	openModalEvent: "openModal",
	actions: {
		openModal: function(modalClass, dispute) {
			this.sendAction('openModalEvent', modalClass, dispute);
		}
	}
});
