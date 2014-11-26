`import Ember from "ember";`

OtpView = Ember.View.extend
	layoutName: "page-form"
	pageTitle: 'Two-factor authentication'
	afterFormLink:
		linkTo: 'login'
		linkText: 'Back to sign in'
	didInsertElement: ->
		@$('input:first').focus()

`export default OtpView;`
