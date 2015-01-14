`import AuthRoute from "./auth";`
`import AnalyticsLogger from "balanced-dashboard/utils/analytics_logger";`

MarketplaceApplicationRoute = AuthRoute.extend
	trackEvent: (message, data) ->
		attributes = AnalyticsLogger.flattenEventData(
			formData: data
			user_email_address: this.container.lookup("auth:main").get("user.email_address")
		)
		AnalyticsLogger.trackEvent(message, attributes)

	model: (params) ->
		store = @container.lookup("store:balanced")
		store
			.fetchItem("marketplace-application", "/applications/#{params.id}/")
			.then (marketplaceApplication) =>
				marketplaceApplication

	afterModel: (marketplaceApplication) ->
		@controllerFor("register-flow/user-marketplace")
			.addApiKeyToCurrentUserFlow(marketplaceApplication.get("api_key"))
			.then =>
				@trackEvent "Marketplace linked to user", marketplaceApplication.getDebuggingProperties()
		@transitionTo "marketplaces"



`export default MarketplaceApplicationRoute`
