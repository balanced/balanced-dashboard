`import Ember from "ember";`
`import BkApiKeyProduction from "balanced-addon-models/models/api-key-production";`

ApiKeyProduction = BkApiKeyProduction.extend
	marketplaceCategory: "goods_services"
	businessType: "llc"

	isProduction: false

	getStore: ->
		@get("container")
			.lookupFactory("store:balanced")
			.create(apiKey: @get("secret"))

`export default ApiKeyProduction;`
