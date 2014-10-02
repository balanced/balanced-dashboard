import TextFormFieldView from "./text-form-field";

var MetaFormFieldView = TextFormFieldView.extend({
	layoutName: null,
	templateName: "form-fields/meta-form-field",

	key: function(a, value) {
		var model = this.get("model");
		if (arguments.length > 1) {
			return (model) ? model["key"] = value : null;
		}
		return (model) ? model["key"] : null;
	}.property("model"),

	value: function(a, value) {
		var model = this.get("model");

		if (arguments.length > 1) {
			return (model) ? model["value"] = value : null;
		}
		return (model) ? model["value"] : null;
	}.property("model")
});

export default MetaFormFieldView;
