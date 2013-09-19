Balanced.AddTestMarketplaceView = Balanced.View.extend({
	templateName: 'marketplaces/_add_test',
	tagName: 'form',

	name: null,

	isSubmitting: false,

	actions: {
		add: function () {
			if (this.get('isSubmitting')) {
				return;
			}
			this.set('isSubmitting', true);

			var self = this;
			var marketplaceName = this.get('name');
			if (!marketplaceName) {
				self.set('isSubmitting', false);
				return;
			}
			var marketplace = Balanced.UserMarketplace.create({
				uri: Balanced.Auth.get('user').get('marketplaces_uri'),
				name: marketplaceName
			});

			marketplace.save().then(function () {
				self.set('isSubmitting', false);
				self.set('name', null);
				Balanced.Auth.get('user').reload();
			}, function () {
				self.set('isSubmitting', false);
			});
		}
	}
});
