Balanced.MFAInformationModalComponent = Ember.Component.extend({
	classNames: ['modal-container'],

	didInsertElement: function() {
		this.get('targetObject').on('openMFAInformationModal', this, this.open);
	},

	willDestroyElement: function() {
		this.get('targetObject').off('openMFAInformationModal', this, this.open);
		$('#mfa-information').modal('hide');
	},

	open: function() {
		$('#mfa-information').modal({
			manager: this.$()
		}).on('hidden', _.bind(this.hidden, this));
	},

	hidden: function() {
		var attemptedTransition = Balanced.Auth.get('attemptedTransition');
		if (attemptedTransition) {
			attemptedTransition.retry();
			Balanced.Auth.set('attemptedTransition', null);
		} else {
			this.transitionToRoute('index');
		}
	},

	actions: {
		submit: function() {
			this.transitionToRoute('accountSecurity');
		}
	}
});
