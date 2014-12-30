`import AuthRoute from "./auth";`

MarketplaceApplicationRoute = AuthRoute.extend
	model: (params) ->
		store = @container.lookup("store:balanced")

		store
			.fetchItem("marketplace-application", "/applications/#{params.id}/")
			.then (marketplaceApplication) =>
				marketplaceApplication

	actions:
		linkToUser: (marketplaceApplication) ->
			@controllerFor("register-flow/user-marketplace")
				.addApiKeyToCurrentUser(marketplaceApplication.get("api_key"))
				.then (href) =>
					mp = @container.lookupFactory("model:marketplace").find(href)
					@transitionTo("marketplace", mp)



`export default MarketplaceApplicationRoute`
