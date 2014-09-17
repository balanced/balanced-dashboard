`import SessionManager from "balanced-dashboard/auth"`

UserSessionInitializer =
	name: "userSession"
	initialize: (container, App) ->
		App.deferReadiness()
		App.NET.loadCSRFTokenIfNotLoaded()
			.then ->
				SessionManager.getCurrentLogin()
			.finally ->
				App.advanceReadiness()

`export default UserSessionInitializer`
