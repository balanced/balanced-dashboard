`import Ember from "ember";`

AuthRoute = Ember.Route.extend
	beforeModel: (transition) ->
		sessionsController = this.controllerFor("sessions")
		if !this.controllerFor("sessions").get("isUserPresent")
			this.controllerFor("sessions").set("transitionPendingLogin", transition)
			this.transitionTo('login')

`export default AuthRoute;`
