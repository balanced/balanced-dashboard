Balanced.User = Balanced.Model.extend({

	user_marketplaces: Balanced.Model.hasMany('user_marketplaces', 'Balanced.UserMarketplace'),

	user_marketplace_for_uri: function (uri) {
		return this.get('user_marketplaces').find(function (userMarketplace) {
			return userMarketplace.get('uri') === uri;
		});
	},

	gravatar: function () {
		var emailHash = this.get('email_hash');
		return Balanced.Utils.toGravatar(emailHash);
	}.property('email_hash'),


	deserialize: function (json) {
		this._super(json);

		json.user_marketplaces = json.marketplaces || [];
		delete json.marketplaces;

		json.user_marketplaces.sort(function (a, b) {
			if (a.name === b.name) {
				return 0;
			}
			return (a.name > b.name) ? 1 : -1;
		});
	},

	allow_hold_card: function() {
		// Should check an admin flag for this someday, right exists so devs
		// can create holds easily for testing
		return false;
	}.property()
});

Balanced.Adapter.registerHostForType(Balanced.User, ENV.BALANCED.AUTH);
