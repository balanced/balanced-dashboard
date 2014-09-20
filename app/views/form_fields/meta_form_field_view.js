require("./text_form_field_view");

Balanced.MetaFormFieldView = Balanced.TextFormFieldView.extend({
	setModelValue: function(value) {
		var model = this.get("model");
		var field = this.get("field");
		return (model) ? model[field] = value : null;
	},

	getModelValue: function() {
		var model = this.get("model");
		var field = this.get("field");
		return (model) ? model[field] : null;
	}
});
