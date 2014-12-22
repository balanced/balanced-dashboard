`import Ember from "ember";`
`import BkApiKeyProduction from "balanced-addon-models/models/api-key-production";`
`import EmberValidations from "ember-validations";`

PHONE_NUMBER_VALID_CHARACTERS = /[\d- () +]/g
VALID_TYPE_VALUES = ["business", "person"]
VALID_DATE_FORMAT = /^(\d\d?)(\s*[-\/]\s*)(\d\d\d\d)$/
CURRENT_YEAR = new Date().getFullYear()

isBetween = (num, min, max) ->
	min < num && num < max

ApiKeyProduction = BkApiKeyProduction.extend
	marketplaceCategory: "goods_services"
	companyType: "llc"
	validations:
		"type":
			presence: true
			inclusion:
				in: VALID_TYPE_VALUES

		"phone_number":
			presence: true
			length:
				maximum: 15
			inline: EmberValidations.validator ->
				number = @get("phone_number")
				if number && !Ember.isBlank(number.replace(PHONE_NUMBER_VALID_CHARACTERS, ""))
					'has invalid characters (only "+", "-", "(", ")" spaces and numbers are accepted)'

		"business.name":
			presence:
				if: (object) ->
					object.get("isBusiness")

		"incorporationDate":
			presence:
				if: "isBusiness"
			inline: EmberValidations.validator ->
				MONTHS = Ember.A [1,2,3,4,5,6,7,8,9,10,11,12]
				if @get("isBusiness")
					date = $.trim(@get("incorporationDate"))
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

	saveAsMarketplaceApplication: ->
		secret = @get("secret")
		Ember.assert "Secret key is not defined.", !Ember.isBlank(secret)
		mpApplication = this.store.build("marketplace-application", secret: secret)
		mpApplication.save()

`export default ApiKeyProduction;`
