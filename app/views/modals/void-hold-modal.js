import ModalBaseView from "./modal-base";
import Wide from "./mixins/wide-modal-mixin";

var VoidHoldModalView = ModalBaseView.extend(Wide, {
	templateName: "modals/void-hold-modal",
	elementId: 'void-hold',
	title: "Void this hold",

	isSaving: Ember.computed.oneWay("model.isSaving"),

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
