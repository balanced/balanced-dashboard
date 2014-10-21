`import Ember from "ember";`

OtpController = Ember.Controller.extend(
	needs: ["sessions", "notification_center"]
	getNotificationController: ->
		@get "controllers.notification_center"
	getSessionsController: ->
		@get "controllers.sessions"

	focus: ->
		$('#forgot-form input:first').focus()

	actions:
		otpSubmit: ->
			model = @get("model")
			auth = @get("auth")
			controller = @getNotificationController()

			successCallback = (session) =>
				@getNotificationController().clearAlerts()
				@getSessionsController().send("afterLoginTransition")
				console.log session
				auth.setAuthPropertiesFromSession(session)

			errorCallback = =>
				auth.forgetLogin()
				controller.clearAlerts()
				model.set("otpCode", null)
				model.get("validationErrors.fullMessages").forEach (message) ->
					controller.alertError(message)
				@focus()

			@set('isSubmitting', true)
			model.save()
				.then(successCallback, errorCallback)
				.finally =>
					@set('isSubmitting', false)
)

`export default OtpController`
