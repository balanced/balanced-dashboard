`import Ember from "ember";`

LabelBaseView = Ember.View.extend(
	tagName: "dt"
	templateName: "detail-views/summary-items/label-base"

	isModalEditLink: Ember.computed "modalEditClass", ->
		!Ember.isBlank(@get("modalEditClass"))

	iconClasses: Ember.computed "icon", ->
		icons = ["icon-#{@get("icon")}"]
		icons.join(" ")
)

`export default LabelBaseView;`
