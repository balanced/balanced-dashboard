import ModalFormFieldView from "./modal-form-field";

var StaticTextModalFormFieldView = ModalFormFieldView.extend({
	templateName: "form-fields/static-text-modal-form-field",
	classNameBindings: [":control-group"],
	isError: false,

	errorMessages: function() {
		return [];
	}.property()
});

export default StaticTextModalFormFieldView;
