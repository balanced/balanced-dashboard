import ModalBaseView from "./modal-base";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";
import Callback from "balanced-dashboard/models/callback";
import Wide from "balanced-dashboard/views/modals/mixins/wide-modal-mixin";
import Save from "balanced-dashboard/views/modals/mixins/object-action-mixin";

var AddCallbackModalView = ModalBaseView.extend(Wide, Form, Save, {
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
		var uri = this.get('marketplace.callbacks_uri');
		var m = this.container.lookup("model:callback");
		m.setProperties({
			uri: uri,
			revision: '1.1'
		});
		return m;
	}.property('marketplace.callbacks_uri'),

	onModelSaved: function(model) {
		this.getNotificationController().alertSuccess('Your callback has been added.', {
			expire: true
		});
		this.close();
	},

	save: function(model) {
		this.executeAction(function() {
			return model.validateAndSave();
		});
	},

	actions: {
		save: function() {
			var model = this.get("model");
			this.save(model);
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
