class SummaryItemViewGenerator
	@view: (template, model) ->
		new @(template, model)

	constructor: (@template, @model) ->

	addTo: (summarySectionView) ->
		summarySectionView.addItem("detail-views/resource-summary",
			model: @model
			valueBinding: "model.source"
			hoverValueBinding: "model"
		)

`export default SummaryItemViewGenerator;`
