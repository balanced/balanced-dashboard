Balanced.DeleteMarketplaceModalView = Balanced.DeleteModalView.extend({
	name: 'Remove marketplace',
	description: 'This marketplace will be removed from your access list.',
	controllerEventName: 'openDeleteMarketplaceModal',
	idElement: 'delete-marketplace',
	submitTitle: 'Confirm',
	submittingTitle: 'Removing...',

	open: function(marketplace) {
		//  let's construct a uri even tho that's a little horrid. the reason
		// for doing so is we generally (except for this single case), deal
		// with api based uris
		var user = this.get('user');
		var uri = Balanced.Utils.combineUri(user.get('marketplaces_uri'), marketplace.get('id'));
		var model = Balanced.UserMarketplace.create({
			uri: uri,
			isLoaded: true
		});

		this._super(model);
	},

	afterSave: function() {
		var user = this.get('user');
		user.reload();
	}
});
