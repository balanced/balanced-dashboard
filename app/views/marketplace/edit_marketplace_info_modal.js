Balanced.EditMarketplaceInfoModalView = Balanced.View.extend({
	templateName: 'modals/edit_marketplace_info',

	actions: {
		open: function() {
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
				$('#edit-marketplace-info').modal('hide');
			});
		}
	}
});
