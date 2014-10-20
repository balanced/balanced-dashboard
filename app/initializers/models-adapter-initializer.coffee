`import BaseConnection from "balanced-dashboard/lib/connections/base-connection";`
`import ENV from "balanced-dashboard/config/environment";`
`import Model from "balanced-dashboard/models/core/model";`
`import ModelArray from "balanced-dashboard/models/core/model-array";`

ModelsAdapterInitializer =
	name: "modelsAdapter"
	initialize: (container, App) ->
		if App.ADAPTER
			adapter = App.ADAPTER
		else
			adapter = container.lookup("adapter:ajax")

		register = (factoryName, host) ->
			klass = container.lookupFactory("model:#{factoryName}")
			adapter.registerHostForType(klass, host)

		register("claim", ENV.BALANCED.AUTH)
		register("dispute-document", ENV.BALANCED.JUSTITIA)
		register("download", ENV.BALANCED.WWW)
		register("forgot-password", ENV.BALANCED.AUTH)
		register("justitia-dispute", ENV.BALANCED.JUSTITIA)
		register("reset-password", ENV.BALANCED.AUTH)
		register("user", ENV.BALANCED.AUTH)
		register("user-invite", ENV.BALANCED.AUTH)
		register("user-marketplace", ENV.BALANCED.AUTH)

		container.register("adapter:main", adapter, {
			instantiate: false
		})

`export default ModelsAdapterInitializer;`
