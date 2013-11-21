Balanced.AddCallbackModalView = Balanced.View.extend({
	templateName: 'modals/add_callback',

	callback_revisions: [{
		label: 'Revision 1.0',
		value: '1.0'
	}, {
		label: 'Revision 1.1',
		value: '1.1'
	}],

	actions: {
		open: function() {
			var callback = Balanced.Callback.create({
				uri: this.get('marketplace').get('callbacks_uri'),
				url: '',
				revision: '1.0'
			});
			this.set('model', callback);
			$('#add-callback').modal({
				manager: this.$()
			});
		},

		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			var self = this;
			var callback = this.get('model');

			callback.save().then(function() {
				self.get('marketplace.callbacks').reload();
				$('#add-callback').modal('hide');
			});
		}
	}
});
