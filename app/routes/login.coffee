`import Ember from 'ember';`
`import Login from "../models/login";`

LoginRoute = Ember.Route.extend
	pageTitle: 'Login'

	beforeModel: ->
		sessionsController = this.controllerFor("sessions")
		if sessionsController.get("isUserRegistered")
			@transitionTo("marketplaces.index")

	model: ->
		return Ember.Object.create()
		# return Login.create()

`export default LoginRoute;`
