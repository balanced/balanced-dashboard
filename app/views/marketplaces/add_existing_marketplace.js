Balanced.AddExistingMarketplaceView = Balanced.View.extend({
	templateName: 'marketplaces/_add_existing',
	tagName: 'form',

	secret: null,

	isSubmitting: false,

	actions: {
		add: function() {
			if (this.get('isSubmitting')) {
				return;
			}
			this.set('isSubmitting', true);

			var self = this;
			var secret = this.get('secret');
			if (!secret) {
				self.set('isSubmitting', false);
				return;
			}
			var marketplace = Balanced.UserMarketplace.create({
				uri: Balanced.Auth.get('user').get('marketplaces_uri'),
				secret: secret
			});

			marketplace.save().then(function() {
				self.set('isSubmitting', false);
				self.set('secret', null);
				Balanced.Auth.get('user').reload();
			}, function() {
				self.set('isSubmitting', false);
			});
		}
	}
});
