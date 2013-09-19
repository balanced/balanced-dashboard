Balanced.AddCallbackModalView = Balanced.View.extend({
	templateName: 'modals/add_callback',

	actions: {
		open: function () {
			var callback = Balanced.Callback.create({
				uri: this.get('marketplace').get('callbacks_uri'),
				url: ''
			});
			this.set('model', callback);
			$('#add-callback').modal({
				manager: this.$()
			});
		},

		save: function () {
			if (this.get('model.isSaving')) {
				return;
			}

			var self = this;
			var callback = this.get('model');

			callback.save().then(function () {
				self.get('marketplace.callbacks').reload();
				$('#add-callback').modal('hide');
			});
		}
	}
});
