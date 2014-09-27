import BaseFormFieldView from "./base-form-field";

var TextAreaFormFieldView = BaseFormFieldView.extend({
	templateName: "form-fields/textarea-form-field",
	maxlength: 0,
	explanationText: function() {
		var maxLength = this.get('maxlength');

		if (maxLength > 0) {
			var noteLength = this.get('value') ? this.get('value.length') : 0;
			var remaining = maxLength - noteLength;
			return "%@ characters remaining".fmt(remaining);
		}
	}.property('value.length'),

});

export default TextAreaFormFieldView;
