Balanced.EventsController = Balanced.ObjectController.extend({
	eventData: Ember.computed.alias('model.entity'),

	actions: {
		replay: function(eventCallback) {
			if (!eventCallback) {
				return;
			}

			eventCallback.save();
		}
	}
});
