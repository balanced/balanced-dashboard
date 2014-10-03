import Save from "./mixins/object-action-mixin";
import ModalBaseView from "./modal-base";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";
import Full from "balanced-dashboard/views/modals/mixins/full-modal-mixin";

var MarketplaceEditModalView = ModalBaseView.extend(Full, Form, Save, {
	templateName: 'modals/marketplace-edit-modal',
	elementId: "edit-marketplace-info",
	title: "Edit marketplace information",
	cancelButtonText: "Cancel",
	submitButtonText: "Edit",

	model: function() {
		// operate on a copy so we don't mess up the original object
		var marketplace = Ember.copy(this.get('marketplace'), true);
		marketplace.set('isNew', false);
		return marketplace;
	}.property("marketplace"),

	actions: {
		save: function() {
			var marketplace = this.get("marketplace");
			this.save(this.get("model"))
				.then(function(model) {
					marketplace.reload();
				});
		}
	}
});

MarketplaceEditModalView.reopenClass({
	open: function(marketplace) {
		return this.create({
			marketplace: marketplace
		});
	}
});

export default MarketplaceEditModalView;
