Balanced.User = Balanced.Model.extend(Ember.Validations, {
	user_marketplaces: Balanced.Model.hasMany('user_marketplaces', 'Balanced.UserMarketplace'),

	hasProductionMarketplace: function() {
		return !!this.get('user_marketplaces').findBy('production', true);
	}.property('user_marketplaces', 'user_marketplaces.@each.production'),

	hasTestMarketplace: function() {
		return !!this.get('user_marketplaces').findBy('test', true);
	}.property('user_marketplaces', 'user_marketplaces.@each.test'),

	user_marketplace_for_id: function(id) {
		return this.get('user_marketplaces').findBy('id', id);
	},

	gravatar: Balanced.computed.transform('email_hash', Balanced.Utils.toGravatar),
	multiFactorAuthUri: Balanced.computed.fmt('id', ENV.BALANCED.AUTH + '/users/%@/otp'),

	validations: {
		email: {
			presence: true,
			length: {
				minimum: 6
			},
			format: /.+@.+\..{2,4}/
		},
		existing_password: {
			presence: true
		},
		password: {
			match: {
				property: "confirm_password"
			}
		}
	}
});

Balanced.Adapter.registerHostForType(Balanced.User, ENV.BALANCED.AUTH);

Balanced.User.reopenClass({
	serializer: Balanced.Rev0Serializer.extend({
		extractSingle: function(rootJson, type, href) {
			var json = this._super(rootJson, type, href);

			json.user_marketplaces = json.marketplaces || [];
			delete json.marketplaces;

			json.user_marketplaces.sort(function(a, b) {
				if (a.name === b.name) {
					return 0;
				}
				return (a.name > b.name) ? 1 : -1;
			});

			return json;
		},
	}).create(),
});
