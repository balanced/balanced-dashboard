import ModalBaseView from "./modal-base";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";
import Callback from "balanced-dashboard/models/callback";
import Wide from "balanced-dashboard/views/modals/mixins/wide-modal-mixin";

var AddCallbackModalView = ModalBaseView.extend(Wide, Form, {
	templateName: 'modals/add-callback-modal',
	elementId: "add-callback",
	title: "Add a callback",
	cancelButtonText: "Cancel",
	submitButtonText: "Add",

	callbackRevisions: [{
		label: 'Revision 1.1',
		value: '1.1'
	}, {
		label: 'Revision 1.0',
		value: '1.0'
	}],

	model: function() {
		var marketplace = this.get('marketplace');

		return Callback.create({
			uri: marketplace.get('callbacks_uri'),
			url: '',
			revision: '1.1'
		});
	}.property('marketplace'),

	actions: {
		save: function() {
			var self = this;
			var controller = this.getModalNotificationController();
			var model = this.get("model");

			model.validate();
			if (model.get("isValid")) {
				model.save()
					.then(function(model) {
						self.get('marketplace').reload();
						self.close();
						controller.alertSuccess('Your callback has been added.', {
							expire: true
						});
					});
			} else {
				return Ember.RSVP.reject();
			}
		}
	}
});

AddCallbackModalView.reopenClass({
	open: function(marketplace) {
		return this.create({
			marketplace: marketplace
		});
	},
});

export default AddCallbackModalView;
