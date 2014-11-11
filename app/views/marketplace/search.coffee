`import Ember from "ember";`

MarketplaceSearchView = Ember.View.extend
	overlayClass: 'overlaid'
	isHighlight: false

	mouseEnter: (evt) ->
		@set("isHighlight", true)

	mouseLeave: (evt) ->
		@set("isHighlight", false)

`export default MarketplaceSearchView;`
