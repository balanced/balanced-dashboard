UserInjectorInitializer =
	name: "injectUser"
	initialize: (container, App) ->
		container.typeInjection('controller', 'user', 'user:main')
		container.typeInjection('route', 'user', 'user:main')

`export default UserInjectorInitializer`
