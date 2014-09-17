`import Ember from "ember";`

MarketplacesIndexController = Balanced.ArrayController.extend(Ember.Evented,
	needs: ['application']

	testMarketplaces: Ember.computed.filterBy("auth.user.user_marketplaces", "production", false)
	productionMarketplaces: Ember.computed.filterBy("auth.user.user_marketplaces", "production", true)

	actions:
		goToMarketplace: (marketplace) ->
			this.transitionTo('marketplace', marketplace)
)

Balanced.MarketplacesIndexController = MarketplacesIndexController
`export default MarketplacesIndexController;`
