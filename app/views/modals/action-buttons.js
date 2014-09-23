import Computed from "balanced-dashboard/utils/computed";
import Ember from "ember";

var ActionButtonsView = Ember.View.extend({
	templateName: "modals/action-buttons",
	// override this to customize
	submitTitle: "Submit",

	// override to customize, adds "ing..." to submitTitle if not defined
	submittingTitle: null,

	isSubmitting: Computed.orProperties('parentView.model.isSaving', 'parentView.isSubmitting'),

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

export default ActionButtonsView;
