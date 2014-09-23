`import Computed from "balanced-dashboard/utils/computed";`
`import Rev0Serializer from "balanced-dashboard/serializers/rev0";`
`import UserMarketplace from "./user-marketplace";`
`import Marketplace from "./marketplace";`

User = Balanced.Model.extend Ember.Validations,
	user_marketplaces: Balanced.Model.hasMany('user_marketplaces', UserMarketplace)

	marketplacesLoader: (->
		find: (id) ->
			return Marketplace.findById(id)
	).property()

	hasProductionMarketplace: (->
		!!@get('user_marketplaces').findBy('production', true)
	).property('user_marketplaces', 'user_marketplaces.@each.production')

	hasTestMarketplace: (->
		!!@get('user_marketplaces').findBy('test', true)
	).property('user_marketplaces', 'user_marketplaces.@each.test')

	user_marketplace_for_id: (id) ->
		@get('user_marketplaces').findBy('id', id)

	gravatar: Computed.transform('email_hash', Balanced.Utils.toGravatar)
	multiFactorAuthUri: Computed.fmt('id', ENV.BALANCED.AUTH + '/users/%@/otp')

	validations:
		existing_password:
			presence: true
		password:
			match:
				property: "confirm_password"

User.reopenClass(
	serializer: Rev0Serializer.extend(
		extractSingle: (rootJson, type, href) ->
			json = this._super(rootJson, type, href)
			json.user_marketplaces = json.marketplaces || []
			delete json.marketplaces
			json.user_marketplaces.sort (a, b) ->
				if a.name == b.name
					return 0
				else if a.name > b.name
					return 1
				else
					return -1
			return json
	).create()
)

`export default User`
