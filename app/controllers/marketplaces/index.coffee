`import Ember from "ember";`

MarketplacesIndexController = Ember.ArrayController.extend
	needs: ["application"]
	testMarketplaces: Ember.computed.filterBy("auth.user.user_marketplaces", "production", false)
	productionMarketplaces: Ember.computed.filterBy("auth.user.user_marketplaces", "production", true)

	actions:
		goToMarketplace: (marketplace) ->
			@transitionTo('marketplace', marketplace)

`export default MarketplacesIndexController;`
