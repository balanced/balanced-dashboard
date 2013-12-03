Balanced.ChangePasswordModalComponent = Ember.Component.extend({
	submitAction: 'submitCaptureHold',
	classNames: ['modal-container'],

	willDestroyElement: function() {
		$('#capture-hold').modal('hide');
	},

	actions: {
		open: function() {
			var debit = Balanced.Debit.create({
				uri: this.get('hold.debits_uri'),
				hold_uri: this.get('hold.uri'),
				amount: null
			});

			debit.on('didCreate', function() {
				$('#capture-hold').modal('hide');
			});

			this.set('model', debit);

			$('#capture-hold').modal({
				manager: this.$()
			});
		},

		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}


		}
	}
});
