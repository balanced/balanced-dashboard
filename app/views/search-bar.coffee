`import Ember from "ember";`

SearchBarView = Ember.View.extend
	layoutName: "search-bar-layout"

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

`export default SearchBarView;`
