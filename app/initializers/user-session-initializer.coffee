`import SessionManager from "balanced-dashboard/auth"`

Initializer =
	name: "userSession"
	initialize: (container, App) ->
		App.deferReadiness()
		SessionManager.loadCsrfTokenIfNotLoaded()
			.then ->
				SessionManager.getCurrentLogin()
			.finally ->
				App.advanceReadiness()

`export default Initializer`
