import ModalComponent from "./modal";

var VoidHoldModalComponent = ModalComponent.extend({
	submitAction: false,

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

export default VoidHoldModalComponent;
