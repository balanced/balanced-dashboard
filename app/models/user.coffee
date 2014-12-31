`import ENV from "balanced-dashboard/config/environment";`
`import Computed from "balanced-dashboard/utils/computed";`
`import Rev0Serializer from "balanced-dashboard/serializers/rev0";`
`import Model from "./core/model";`
`import Utils from "balanced-dashboard/lib/utils";`

User = Model.extend Ember.Validations,
	user_marketplaces: Model.hasMany('user_marketplaces', "user_marketplace")

	marketplacesLoader: (->
		find: (id) ->
			BalancedApp.__container__.lookupFactory("model:marketplace").findById(id)
	).property()

	hasProductionMarketplace: (->
		!!@get('user_marketplaces').findBy('production', true)
	).property('user_marketplaces', 'user_marketplaces.@each.production')

	hasTestMarketplace: (->
		!!@get('user_marketplaces').findBy('test', true)
	).property('user_marketplaces', 'user_marketplaces.@each.test')

	user_marketplace_for_id: (id) ->
		@get('user_marketplaces').findBy('id', id)

	gravatar: Computed.transform('email_hash', Utils.toGravatar)
	multiFactorAuthUri: Computed.fmt('id', ENV.BALANCED.AUTH + '/users/%@/otp')

	addSecret: (apiKeySecret) ->
		connection = @getAuthConnection()

		UserMarketplace = BalancedApp.__container__.lookupFactory("model:user-marketplace")

		uri = @get("marketplaces_uri")
		if uri.indexOf("http") != 0
			uri = ENV.BALANCED.AUTH + uri

		connection
			.post(uri, secret: apiKeySecret)
			.then (response) =>
				@reload().then ->
					response.uri

	getAuthConnection: ->
		AuthConnection = require("balanced-dashboard/lib/connections/auth-connection").default
		AuthConnection.create()

	removeMarketplace: (marketplaceId) ->
		uri = "#{ENV.BALANCED.AUTH}#{@get("uri")}/marketplaces/#{marketplaceId}"
		@getAuthConnection().delete(uri)

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
