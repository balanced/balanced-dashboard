User = Balanced.Model.extend Ember.Validations,
	user_marketplaces: Balanced.Model.hasMany('user_marketplaces', 'Balanced.UserMarketplace')

	marketplacesLoader: (->
		find: (id) ->
			return Balanced.Marketplace.findById(id)
	).property()

	hasProductionMarketplace: (->
		!!@get('user_marketplaces').findBy('production', true)
	).property('user_marketplaces', 'user_marketplaces.@each.production')

	hasTestMarketplace: (->
		!!@get('user_marketplaces').findBy('test', true)
	).property('user_marketplaces', 'user_marketplaces.@each.test')

	user_marketplace_for_id: (id) ->
		@get('user_marketplaces').findBy('id', id)

	gravatar: Balanced.computed.transform('email_hash', Balanced.Utils.toGravatar)
	multiFactorAuthUri: Balanced.computed.fmt('id', ENV.BALANCED.AUTH + '/users/%@/otp')

	validations:
		existing_password:
			presence: true
		password:
			match:
				property: "confirm_password"

Balanced.Adapter.registerHostForType(User, ENV.BALANCED.AUTH)

User.reopenClass(
	serializer: Balanced.Rev0Serializer.extend(
		extractSingle: (rootJson, type, href) ->
			json = this._super(rootJson, type, href)
			json.user_marketplaces = json.marketplaces || []
			delete json.marketplaces
			json.user_marketplaces.sort (a, b) ->
				if (a.name == b.name)
					return 0
				return (a.name > b.name) ? 1 : -1
			return json
	).create()
)

Balanced.User = User
`export default User`
