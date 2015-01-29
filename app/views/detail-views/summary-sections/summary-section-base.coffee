`import Ember from "ember";`

SummarySectionBase = Ember.View.extend(
	templateName: "detail-views/summary-section-base"

	didInsertElement: ->
		@_super()
		@generateItems()

	addLabel: (text, icon) ->
		@get("resourcesList").addLabel(text, icon)

	addItem: (viewClassName, viewAttributes) ->
		@get("resourcesList").addItem(viewClassName, viewAttributes)

	addSummaryItem: (name, attrs) ->
		@addItem("detail-views/summary-items/#{name}", attrs)

	addInternalDescriptionLabel: ->
		@addLabel("Internal description",
			icon: "description",
			model: @get("model"),
			modalEditClass: @container.lookupFactory("view:modals/edit-description-modal")
		)

)

`export default SummarySectionBase;`
