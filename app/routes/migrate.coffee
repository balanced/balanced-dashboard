`import Ember from "ember";`
`import AuthRoute from "./auth";`

Route = AuthRoute.extend(
	pageTitle: "Migrate"
	setupController: (controller) ->
		@controllerFor("notification_center").clearAlerts()
)

`export default Route;`
