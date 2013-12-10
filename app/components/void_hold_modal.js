require('app/components/modal');

Balanced.VoidHoldModalComponent = Balanced.ModalComponent.extend({
	actions: {
		save: function() {
			if (this.get('hold.isSaving')) {
				return;
			}

			var hold = this.get('hold');
			hold.set('is_void', true);

			this._super(hold);
		}
	}
});
