Balanced.VoidHoldModalComponent = Ember.Component.extend({
	classNames: ['modal-container'],

	willDestroyElement: function() {
		$('#void-hold').modal('hide');
	},

	actions: {
		open: function () {
			$('#void-hold').modal({
				manager: this.$()
			});
		},

		save: function () {
			if (this.get('hold.isSaving')) {
				return;
			}

			var hold = this.get('hold');
			hold.set('is_void', true);
			hold.save();
		}
	}
});
