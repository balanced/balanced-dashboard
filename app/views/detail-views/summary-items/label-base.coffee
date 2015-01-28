`import Ember from "ember";`

LabelBaseView = Ember.View.extend(
	tagName: "dt"
	templateName: "detail-views/summary-items/label-base"

	iconClasses: Ember.computed "icon", ->
		icons = ["icon-#{@get("icon")}"]
		icons.join(" ")
)

`export default LabelBaseView;`
