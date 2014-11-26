`import Ember from "ember";`

LoginView = Ember.View.extend
	layoutName: 'page-form'
	pageTitle: 'Sign in'
	afterFormLink:
		linkTo: 'setup_guest_user'
		linkText: 'Create an account'
	didInsertElement: ->
		@$('input:first').focus()

`export default LoginView;`
