Balanced.ModalsContainerController = Ember.Controller.extend({
	registerContainer: function(modalsContainer) {
		this.set("modalsContainer", modalsContainer);
	},

	close: function() {
		this.get("modalsContainer").forEach(function(modal) {
			modal.close();
		});
	},

	open: function(klass, args) {
		this.close();
		var modalView = klass.open.apply(klass, args);
		var modalsContainer = this.get("modalsContainer");

		Ember.run(function() {
			modalsContainer.pushObject(modalView);
		});
		modalView
			.open()
			.on("hidden.bs.modal", function() {
				modalsContainer.removeObject(modalView);
			});

		return modalView;
	},
});
