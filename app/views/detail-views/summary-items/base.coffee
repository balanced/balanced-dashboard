`import Ember from "ember";`

BaseSummaryItemView = Ember.View.extend(
	tagName: "dd"
	templateName: "detail-views/summary-items/base"
	classNameBindings: []

	isHasButton: Ember.computed("buttonModal", ->
		!Ember.isBlank(@get("buttonModal"))
	)

	isLink: false
	isLoading: true
	isBlank: Ember.computed("text", ->
		Ember.isBlank @get("text")
	)

	routeName: Ember.computed.reads("model.route_name")
	hoverValue: null

	learnMoreText: null
	isLearnMoreText: Ember.computed "learnMoreText", ->
		!Ember.isBlank(@get("learnMoreText"))

	isShowLearnMoreSection: false

	actions:
		toggleDrawer: ->
			@toggleProperty("isShowLearnMoreSection")
)

`export default BaseSummaryItemView;`
