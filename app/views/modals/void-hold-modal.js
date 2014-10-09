import ModalBaseView from "./modal-base";

var VoidHoldModalView = ModalBaseView.extend({
	templateName: "modals/void-hold-modal",
	elementId: '#void-hold',
	title: "Void this hold",

	actions: {
		save: function() {
			var hold = this.get('model');
			var self = this;
			hold.set('is_void', true);

			hold.save().then(function() {
				self.close();
			});
		}
	}
});

VoidHoldModalView.reopenClass({
	open: function(hold) {
		return this.create({
			model: hold
		});
	},
});

export default VoidHoldModalView;
