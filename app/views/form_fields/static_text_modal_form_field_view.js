Balanced.FormFields.StaticTextModalFormFieldView = Balanced.FormFields.ModalFormFieldView.extend({
	templateName: "form_fields/static_text_modal_form_field",
	classNameBindings: [":control-group"],
	isError: false,
	errorMessages: function() {
		return [];
	}.property()
});
