import Ember from "ember";

var EventsController = Ember.ObjectController.extend({
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

export default EventsController;
