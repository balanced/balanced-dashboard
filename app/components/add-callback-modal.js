import ModalComponent from "./modal";
import Callback from "balanced-dashboard/models/callback";

var AddCallbackModalComponent = ModalComponent.extend({
	callback_revisions: [{
		label: 'Revision 1.0',
		value: '1.0'
	}, {
		label: 'Revision 1.1',
		value: '1.1'
	}],
	submitAction: false,

	actions: {
		open: function() {
			var self = this;

			var callback = Callback.create({
				uri: this.get('marketplace').get('callbacks_uri'),
				url: '',
				revision: '1.0'
			});

			callback.one('didCreate', function() {
				self.get('marketplace.callbacks').reload();
			});

			this._super(callback);
		}
	}
});

export default AddCallbackModalComponent;
