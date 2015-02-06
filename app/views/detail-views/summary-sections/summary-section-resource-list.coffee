`import Ember from "ember";`

SummarySectionResourceList = Ember.ContainerView.extend(
	tagName: "dl"
	classNames: ["linked-resources"]

	addItem: (viewName, attributes) ->
		view = @createChildView(viewName, attributes)
		@pushObject view
		view

	addLabel: (labelText, labelIcon) ->
		if Ember.typeOf(labelIcon) == "string"
			attributes =
				icon: labelIcon
		else
			attributes = labelIcon
		attributes.text = labelText
		@addItem("detail-views/summary-items/label-base", attributes)
)

`export default SummarySectionResourceList;`
