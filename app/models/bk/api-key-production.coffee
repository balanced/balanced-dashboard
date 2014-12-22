`import Ember from "ember";`
`import BkApiKeyProduction from "balanced-addon-models/models/api-key-production";`
`import EmberValidations from "ember-validations";`

PHONE_NUMBER_VALID_CHARACTERS = /[\d- () +]/g
VALID_TYPE_VALUES = ["business", "person"]
VALID_DATE_FORMAT = /^(\d\d?)(\s*[-\/]\s*)(\d\d\d\d)$/
CURRENT_YEAR = new Date().getFullYear()

validateDateFormat = (date) ->
	date = $.trim(date)
	MONTHS = Ember.A [1,2,3,4,5,6,7,8,9,10,11,12]
	match = date.match(VALID_DATE_FORMAT)
	if Ember.isBlank(match)
		return "Invalid date format"
	else
		year = parseInt(match[3])
		month = parseInt(match[1])
		if !(1800 < year && year <= CURRENT_YEAR)
			return "Invalid year #{year}"
		if !MONTHS.contains(month)
			return "Invalid month #{month}"

validatePhoneFormat = (number) ->
	number = $.trim(number)
	if !Ember.isBlank(number.replace(PHONE_NUMBER_VALID_CHARACTERS, ""))
		'has invalid characters (only "+", "-", "(", ")" spaces and numbers are accepted)'

ApiKeyProduction = BkApiKeyProduction.extend
	marketplaceCategory: "goods_services"
	companyType: "llc"
	validations:
		type:
			presence: true
			inclusion:
				in: VALID_TYPE_VALUES

		businessName:
			presence:
				if: "isBusiness"
		businessTaxId:
			presence:
				if: "isBusiness"
			length:
				minimum: 4
				if: "isBusiness"

		businessAddressLine1:
			presence:
				if: "isBusiness"
		businessIncorporationDate:
			presence:
				if: "isBusiness"
			inline: EmberValidations.validator ->
				if @get("isBusiness")
					validateDateFormat @get("businessIncorporationDate")

		personFullName:
			presence: true
		personSsnLast4:
			presence: true
			length: 4
			format:
				with: /^\d\d\d\d$/
				message: 'must be letters only'
		personDateOfBirth:
			presence: true
			inline: EmberValidations.validator ->
				validateDateFormat @get("personDateOfBirth")
		personPhoneNumber:
			presence:
				if: "isPerson"
			length:
				maximum: 15
			inline: EmberValidations.validator ->
				if @get("isPerson")
					validatePhoneFormat @get("personPhoneNumber")

	saveAsMarketplaceApplication: ->
		secret = @get("secret")
		Ember.assert "Secret key is not defined.", !Ember.isBlank(secret)
		mpApplication = @store.build("marketplace-application",
			secret: secret
			marketplace_name: @get("marketplaceName")
			business_type: @get("marketplaceCategory")

			street_address: "none"

			merchant_uri: @get("marketplaceUrl")
			domain_url: @get("marketplaceUrl")
			support_email: @get("marketplaceSupportEmailAddress")
			support_phone_number: @get("marketplaceSupportPhoneNumber")

			full_name: @get("personName") || "xxxxxxxxxxxxxxxx"
			owner_phone_number: @get("personPhoneNumber")
			owner_email: @get("personEmailAddress")
			postal_code: @get("personAddressPostalCode")

			current_processor: null,
			current_monthly_volume: 0
		)
		mpApplication.save()

`export default ApiKeyProduction;`
