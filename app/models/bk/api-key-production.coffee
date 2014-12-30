`import Ember from "ember";`
`import BkApiKeyProduction from "balanced-addon-models/models/api-key-production";`

ApiKeyProduction = BkApiKeyProduction.extend
	marketplaceCategory: "goods_services"
	# companyType: "llc"
	businessType: "person"

	personFullName: "Carlos"
	personDateOfBirth: "10 / 1984"
	personAddressPostalCode: "94609"
	personSsnLast4: "1122"
	personPhoneNumber: "777 888 9999"

	getStore: ->
		@get("container")
			.lookupFactory("store:balanced")
			.create(apiKey: @get("secret"))

`export default ApiKeyProduction;`
