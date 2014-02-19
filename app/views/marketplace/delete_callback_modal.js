Balanced.DeleteCallbackModalView = Balanced.View.extend({
	templateName: 'modals/delete_callback',

	didInsertElement: function() {
		this.get('controller').on('openDeleteCallbackModal', this, this.open);
		this._super();
	},

	willDestroyElement: function() {
		this.get('controller').off('openDeleteCallbackModal', this, this.open);
		this._super();
	},

	open: function(callback) {
		this.set('model', callback);
		$('#delete-callback').modal({
			manager: this.$()
		});
	},

	actions: {
		deleteCallback: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			var self = this;
			this.get('model').delete().then(function() {
				$('#delete-callback').modal('hide');
			});
		}
	}
});
