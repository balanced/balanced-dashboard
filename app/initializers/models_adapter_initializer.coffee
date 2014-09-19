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
		Adapter.registerHostForType(Claim, ENV.BALANCED.AUTH)
		Adapter.registerHostForType(DisputeDocument, ENV.BALANCED.JUSTITIA)
		Adapter.registerHostForType(Download, ENV.BALANCED.WWW)
		Adapter.registerHostForType(ForgotPassword, ENV.BALANCED.AUTH)
		Adapter.registerHostForType(JustitiaDispute, ENV.BALANCED.JUSTITIA)
		Adapter.registerHostForType(ResetPassword, ENV.BALANCED.AUTH)
		Adapter.registerHostForType(User, ENV.BALANCED.AUTH)
		Adapter.registerHostForType(UserInvite, ENV.BALANCED.AUTH)
		Adapter.registerHostForType(UserMarketplace, ENV.BALANCED.AUTH)

		container.register("adapter:main", Adapter)
		Balanced.Adapter = Adapter

`export default ModelsAdapterInitializer;`
