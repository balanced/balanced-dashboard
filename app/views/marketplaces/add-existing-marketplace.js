import Ember from "ember";

var AddExistingMarketplaceView = Ember.View.extend({
	tagName: 'form',
	templateName: "marketplaces/add-existing-marketplace",

	secret: null,

	isSubmitting: false,
	actions: {
		add: function() {
			var UserMarketplace = this.get("container").lookupFactory("model:user-marketplace");
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

			var marketplace = UserMarketplace.create({
				uri: this.get('user.marketplaces_uri'),
				secret: secret
			});

			marketplace.save().then(function() {
				self.set('isSubmitting', false);
				self.set('secret', null);
				self.get('user').reload();
			}, function() {
				self.set('isSubmitting', false);
			});
		}
	}
});

export default AddExistingMarketplaceView;
