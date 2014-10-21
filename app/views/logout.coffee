`import Ember from "ember";`

LogoutView = Ember.View.extend
	templateName: 'logout'
	pageTitle: 'Logout'
	afterFormLink:
		linkTo: 'login'
		linkText: 'Back to sign in'

`export default LogoutView;`
