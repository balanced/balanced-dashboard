`import Ember from "ember";`

MarketplaceSearchView = Ember.View.extend
	overlayClass: 'overlaid'
	isHighlight: false

	didInsertElement: ->
		@_super()
		@$().on "click", ".results tbody a", =>
			@get("controller").send("closeSearch")

	mouseEnter: (evt) ->
		@set("isHighlight", true)

	mouseLeave: (evt) ->
		@set("isHighlight", false)

`export default MarketplaceSearchView;`
