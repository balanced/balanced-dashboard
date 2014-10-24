`import Ember from "ember";`

OtpRoute = Ember.Route.extend(
	pageTitle: 'Login'
	beforeModel: ->
		sessionsController = this.controllerFor("sessions")
		if sessionsController.get("isUserRegistered")
			@transitionTo("marketplaces.index")

	setupController: (controller, model) ->
		@_super(controller, model)
		Auth = @get("container").lookup("auth:main")
		model.set "path", Auth.get("lastLoginUri")
		@controllerFor("notification-center").clearAlerts()

	model: ->
		@get("container").lookup("model:otp-login")
)

`export default OtpRoute;`
