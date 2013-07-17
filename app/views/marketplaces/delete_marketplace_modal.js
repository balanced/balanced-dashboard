Balanced.DeleteMarketplaceModalView = Balanced.View.extend({
	templateName: 'modals/delete_marketplace',

	isSubmitting: false,

	didInsertElement: function() {
		this.get('controller').on('openDeleteMarketplaceModal', $.proxy(this.open, this));
	},

	open: function(marketplace) {
		this.set('isSubmitting', false);
		this.set('model', marketplace);
		$('#delete-marketplace').modal('show');
	},

	deleteMarketplace: function () {
		if(this.get('isSubmitting')) {
			return;
		}
		this.set('isSubmitting', true);

		//  let's construct a uri even tho that's a little horrid. the reason
		// for doing so is we generally (except for this single case), deal
		// with api based uris
		var user = Balanced.Auth.get('user');
		var uri = user.get('marketplaces_uri') + '/' + this.get('model').get('id');
		var self = this;
		Balanced.UserMarketplace.create({
			uri: uri,
			isLoaded: true
		}).delete().then(function () {
			self.set('isSubmitting', false);
			$('#delete-marketplace').modal('hide');
			user.refresh();
		}, function() {
			self.set('isSubmitting', false);
		});
	}
});
