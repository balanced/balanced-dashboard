`import Auth from "balanced-dashboard/auth";`

UserInjectorInitializer =
	name: "injectUser"
	initialize: (container, App) ->
		container.typeInjection('controller', 'user', 'user:main')
		container.typeInjection('route', 'user', 'user:main')

		container.register('user:main', null,
			instantiate: false,
			singleton: true
		)

`export default UserInjectorInitializer`
