`import Ember from "ember";`
`import Auth from "../auth";`
`import ENV from "balanced-dashboard/config/environment";`

ERROR_MESSAGES =
  "You need to pass in a confirm token to continue login": "Authentication code is blank."
  "Not found": "Authentication has expired. Please enter your email address and password again."
  "Invalid OTP verification": "The authentication code you entered is invalid. Please log in again."

OtpLogin = Ember.Object.extend(Ember.Validations,
  validations:
    otpCode:
      presence: true

  save: ->
    successCallback = (response) =>
      user = @get("container").lookup("model:user")
      user.populateFromJsonResponse(response.user)
      user

    errorCallback = (response) =>
      message = ERROR_MESSAGES[response.responseJSON.detail]
      message ||= "There was an unknown error submitting your authentication code."
      @get("validationErrors").add("", "server", null, message)
      Ember.RSVP.reject()

    submit = =>
      Auth
        .request(
          url: "#{ENV.BALANCED.AUTH}#{@get("path")}"
          type: 'PUT'
          data:
            confirm: @get("otpCode")
          dataType: 'JSON'
        )

    @validate()
    if @get("isValid")
      submit().then(successCallback, errorCallback)
    else
      Ember.RSVP.reject()
)

`export default OtpLogin;`
