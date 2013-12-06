Balanced.DisableMFAModalComponent = Ember.Component.extend({
	classNames: ['modal-container'],

	didInsertElement: function() {
		console.log('inserted');
		console.log(this.get('controller'), this, this.get('view'), this.get('targetObject'));
		this.get('targetObject').on('openMFAInformationModal', this, this.open);
	},

	willDestroyElement: function() {
		console.log('deserted');
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

	// willDestroyElement: function() {
	// 	$('#mfa-information').modal('hide');
	// },

	actions: {
		submit: function() {

		}
	}
});
