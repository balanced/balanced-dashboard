`import Auth from "balanced-dashboard/auth"`

UserSessionInitializer =
	name: "userSession"
	after: "modelsAdapter"
	initialize: (container, App) ->
		App.deferReadiness()
		Auth.loadCsrfTokenIfNotLoaded()
			.then ->
				Auth.getCurrentLogin()
			.finally ->
				App.advanceReadiness()

`export default UserSessionInitializer`
