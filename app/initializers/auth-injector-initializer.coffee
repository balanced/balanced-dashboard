`import Auth from "balanced-dashboard/auth";`

AuthInjectorInitializer =
	name: 'injectAuth'
	initialize: (container, App) ->
		Auth.applicationContainer = container
		container.register('auth:main', Auth,
			instantiate: false,
			singleton: true
		)
		container.typeInjection('controller', 'auth', 'auth:main')
		container.typeInjection('route', 'auth', 'auth:main')

`export default AuthInjectorInitializer`
