Balanced.EditMarketplaceInfoModalView = Balanced.View.extend({
	templateName: 'modals/edit_marketplace_info',

	actions: {
		open: function() {
			// operate on a copy so we don't mess up the original object
			var marketplace = Ember.copy(this.get('content'), true);
			marketplace.set('isNew', false);
			marketplace.trigger('didCreate');
			this.set('model', marketplace);
			$('#edit-marketplace-info').modal({
				manager: this.$()
			});
		},

		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}
			var self = this;

			var marketplace = this.get('model');
			marketplace.save().then(function() {
				self.get('content').updateFromModel(marketplace);
				$('#edit-marketplace-info').modal('hide');
			});
		}
	}
});
