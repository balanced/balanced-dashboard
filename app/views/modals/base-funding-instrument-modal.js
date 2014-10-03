import ModalBaseView from "./modal-base";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";
import Full from "balanced-dashboard/views/modals/mixins/full-modal-mixin";
import Save from "balanced-dashboard/views/modals/mixins/object-action-mixin";

var BaseFundingInstrumentModalView = ModalBaseView.extend(Full, Form, Save, {
	actions: {
		save: function() {
			var controller = this.get("controller");

			this.save(this.get("model"))
				.then(function(model) {
					controller.transitionToRoute(model.get("route_name"), model);
				});
		},
	}
});

export default BaseFundingInstrumentModalView;
