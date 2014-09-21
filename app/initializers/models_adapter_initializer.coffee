`import AjaxAdapter from "balanced-dashboard/adapters/ajax";`
`import Claim from "balanced-dashboard/models/claim";`
`import DisputeDocument from "balanced-dashboard/models/dispute-document";`
`import Download from "balanced-dashboard/models/download";`
`import ForgotPassword from "balanced-dashboard/models/forgot-password";`
`import JustitiaDispute from "balanced-dashboard/models/justitia-dispute";`
`import ResetPassword from "balanced-dashboard/models/reset-password";`
`import User from "balanced-dashboard/models/user";`
`import UserInvite from "balanced-dashboard/models/user-invite";`
`import UserMarketplace from "balanced-dashboard/models/user-marketplace";`


ModelsAdapterInitializer =
	name: "modelsAdapter"
	initialize: (container, app) ->
		Adapter = AjaxAdapter.create()
		register = (factoryName, host) ->
			klass = container.lookupFactory("model:#{factoryName}")
			Adapter.registerHostForType(klass, host)

		register("claim", ENV.BALANCED.AUTH)
		register("disputed-document", ENV.BALANCED.JUSTITIA)
		register("download", ENV.BALANCED.WWW)
		register("forgot-password", ENV.BALANCED.AUTH)
		register("justitia-dispute", ENV.BALANCED.JUSTITIA)
		register("reset-password", ENV.BALANCED.AUTH)
		register("user", ENV.BALANCED.AUTH)
		register("user-invite", ENV.BALANCED.AUTH)
		register("user-marketplace", ENV.BALANCED.AUTH)

		container.register("adapter:main", Adapter)
		Balanced.Adapter = Adapter

`export default ModelsAdapterInitializer;`
