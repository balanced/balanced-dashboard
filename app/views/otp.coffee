`import Ember from "ember";`

OtpView = Ember.View.extend
	layoutName: "page-form"
	pageTitle: 'Two-factor authentication'
	afterFormLink:
		linkTo: 'login'
		linkText: 'Back to sign in'

`export default OtpView;`
