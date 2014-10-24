`import Ember from "ember";`

getErrorMessage = (xhr) ->
	if xhr.status == 401
		return "The e-mail address or password you entered is invalid."
	else if xhr.responseJSON && xhr.responseJSON.detail
		return xhr.responseJSON.detail
	else if xhr.responseText
		try
			return JSON.parse(xhr, responseText)
		catch e
			return xhr.responseText
	else
		return "Oops, something went wrong"

Login = Ember.Object.extend(Ember.Validations,
	validations:
		emailAddress:
			presence: true
		password:
			presence: true

	save: ->
		validationErrors = @get("validationErrors")
		auth = @get("container").lookup("auth:main")
		validationErrors.clear()
		@validate()
		if @get("isValid")
			auth.signIn(@get("emailAddress"), @get("password"))
				.fail (xhr) =>
					if xhr.status == 409 && xhr.responseJSON.status == "OTP_REQUIRED"
						@set("isNeedsOtp", true)
						Ember.RSVP.resolve(xhr.responseJSON.uri)
					else
						message = getErrorMessage(xhr)
						validationErrors.add("", "server", null, message)
						Ember.RSVP.reject()
		else
			Ember.RSVP.reject()
)

`export default Login;`
