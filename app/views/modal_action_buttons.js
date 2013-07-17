Balanced.ModalActionButtonsView = Balanced.View.extend({
	templateName: 'modals/action_buttons',

	// override this to customize
	submitTitle: "Submit",

	// override to customize, adds "ing..." to submitTitle if not defined
	submittingTitle: null,

	isSubmitting: Ember.computed.alias('parentView.isSubmitting'),

	_submitTitle: function() {
		if(this.get('isSubmitting')) {
			var submittingTitle = this.get('submittingTitle');
			if(submittingTitle) {
				return submittingTitle;
			} else {
				return this.get('submitTitle') + 'ing...';
			}
		} else {
			return this.get('submitTitle');
		}
	}.property('submitTitle', 'submittingTitle', 'isSubmitting')
});
