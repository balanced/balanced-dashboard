Balanced.ModalActionButtonsView = Balanced.View.extend({
	templateName: 'modals/action_buttons',

	// override this to customize
	submitTitle: "Submit",

	// override to customize, adds "ing..." to submitTitle if not defined
	submittingTitle: null,

	isSubmitting: Balanced.computed.orProperties('parentView.model.isSaving', 'parentView.isSubmitting'),

	disabled: Balanced.computed.orProperties('parentView.hasValidDocument', 'isSubmitting'),

	_submitTitle: function() {
		if (this.get('isSubmitting')) {
			var submittingTitle = this.get('submittingTitle');
			if (submittingTitle) {
				return submittingTitle;
			}
			return this.get('submitTitle') + 'ing...';
		}
		return this.get('submitTitle');
	}.property('submitTitle', 'submittingTitle', 'isSubmitting')
});
