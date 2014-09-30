`import Ember from "ember";`

LoginView = Ember.View.extend
	layoutName: 'page-form'
	pageTitle: 'Sign in'
	model: Ember.computed.oneWay("controller.model")

	afterFormLink:
		linkTo: 'setup_guest_user'
		linkText: 'Create an account'

	didInsertElement: ->
		$('form input:first').focus()

	keyDown: (e) ->
		if @templateName == 'login'
			@get('controller').send('reset')

`export default LoginView;`
