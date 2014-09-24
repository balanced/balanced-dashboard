AuthInjectorInitializer =
	name: 'injectAuth'
	initialize: (container, App) ->
		container.typeInjection('controller', 'auth', 'auth:main')
		container.typeInjection('route', 'auth', 'auth:main')

`export default AuthInjectorInitializer`
