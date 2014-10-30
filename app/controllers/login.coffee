`import Ember from "ember";`

LoginController = Ember.ObjectController.extend(
	needs: ["sessions", "notification_center"]
	getNotificationController: ->
		@get "controllers.notification_center"
	getSessionsController: ->
		@get "controllers.sessions"

	focus: ->
		$('#forgot-form input:first').focus()

	actions:
		signIn: ->
			model = @get("model")
			controller = @getNotificationController()
			controller.clearAlerts()

			successCallback = (user) =>
				if model.get("isNeedsOtp")
					@transitionToRoute('otp')
				else
					@getSessionsController().send("afterLoginTransition")

			errorCallback = =>
				model.get("validationErrors.allMessages").forEach (error) ->
					if Ember.isBlank(error[0])
						controller.alertError(error[1])

			@getSessionsController().nuke()
			@set('isSubmitting', true)
			model.save()
				.then(successCallback, errorCallback)
				.finally =>
					@set('isSubmitting', false)
)

`export default LoginController;`
