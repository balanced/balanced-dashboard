`import Utils from "balanced-dashboard/lib/utils";`

MarketplacesIndexRoute = Balanced.Route.extend
	needs: ["application"]
	pageTitle: 'Marketplaces'
	
	beforeModel: ->
		sessionsController = @controllerFor("sessions")
		if !sessionsController.get("isUserRegistered")
			@transitionTo("setup_guest_user")

	afterModel: ->
		Utils.setCurrentMarketplace(null)
		@controllerFor('marketplace').set('content', null)

`export default MarketplacesIndexRoute;`
