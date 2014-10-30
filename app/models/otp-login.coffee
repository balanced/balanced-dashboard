`import Ember from "ember";`
`import ENV from "balanced-dashboard/config/environment";`
`import Session from "./session";`

ERROR_MESSAGES =
	"You need to pass in a confirm token to continue login": "Authentication code is blank."
	"Not found": "Authentication has expired. Please enter your email address and password again."
	"Invalid OTP verification": "The authentication code you entered is invalid. Please log in again."

OtpLogin = Ember.Object.extend(Ember.Validations,
	validations:
		otpCode:
			presence: true

	submitRequest: ->
		auth = @get("container").lookup("auth:main")
		auth.request(
			dataType: 'JSON'
			type: 'PUT'
			url: @getUrl()
			data:
				confirm: @get("otpCode")
		)

	getUrl: ->
		auth = @get("container").lookup("auth:main")
		"#{ENV.BALANCED.AUTH}#{auth.get("lastLoginUri")}"

	save: ->
		successCallback = (response) =>
			Session.fromJsonResponse(response)

		errorCallback = (response) =>
			message = ERROR_MESSAGES[response.responseJSON.detail]
			message ||= "There was an unknown error submitting your authentication code."
			@get("validationErrors").add("", "server", null, message)
			Ember.RSVP.reject()

		@validate()
		if @get("isValid")
			return @submitRequest().then(successCallback, errorCallback)
		else
			return Ember.RSVP.reject()
)

`export default OtpLogin;`
