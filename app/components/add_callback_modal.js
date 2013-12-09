require('app/components/modal');

Balanced.AddCallbackModalComponent = Balanced.ModalComponent.extend({
	callback_revisions: [{
		label: 'Revision 1.0',
		value: '1.0'
	}, {
		label: 'Revision 1.1',
		value: '1.1'
	}],

	actions: {
		open: function() {
			var self = this;

			var callback = Balanced.Callback.create({
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
