Balanced.MFAInformationModalComponent = Ember.Component.extend({
	classNames: ['modal-container'],

	willDestroyElement: function() {
		$('#mfa-information').modal('hide');
	},

	actions: {
		open: function() {
			$('#mfa-information').modal({
				manager: this.$()
			});
		},

		submit: function() {

		}
	}
});
