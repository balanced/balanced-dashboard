Balanced.ModalActionButtonsView = Balanced.View.extend({
	templateName: 'modals/action_buttons',

	// override this to customize
	submitTitle: "Submit",
	submittingTitle: "Submitting...",

	isSubmitting: Ember.computed.alias('parentView.isSubmitting'),

	_submitTitle: function() {
		if(this.get('parentView.isSubmitting')) {
			return this.get('submittingTitle');
		} else {
			return this.get('submitTitle');
		}
	}.property('submitTitle', 'submittingTitle', 'isSubmitting')
});
