require("./text_form_field_view");

Balanced.MetaFormFieldView = Balanced.TextFormFieldView.extend({
	layoutName: null,
	templateName: "form_fields/key_value_form_field",

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
