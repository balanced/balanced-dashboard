`import LoginView from "./login";`

LogoutView = LoginView.extend
	templateName: 'login-flow/logout'
	pageTitle: 'Logout'
	afterFormLink:
		linkTo: 'login'
		linkText: 'Back to sign in'

`export default LogoutView;`
