import ModalBaseView from "./modal-base";
import DeleteMixin from "balanced-dashboard/views/modals/mixins/object-action-mixin";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";
import Full from "balanced-dashboard/views/modals/mixins/full-modal-mixin";

import Utils from "balanced-dashboard/lib/utils";

var MarketplaceDeleteModalView = ModalBaseView.extend(Full, Form, DeleteMixin, {
	elementId: "delete-marketplace",
	templateName: 'modals/marketplace-delete-modal',
	title: "Remove marketplace?",

	getUserMarketplace: function() {
		var marketplacesUri = this.get("user.marketplaces_uri");
		var marketplaceId = this.get("marketplace.id");
		var uri = Utils.combineUri(marketplacesUri, marketplaceId);
		var marketplace = this.get("container").lookup("model:user-marketplace");
		marketplace.setProperties({
			uri: uri,
			isLoaded: true
		});
		return marketplace;
	},

	onModelSaved: function() {
		var c = this.getNotificationController();
		c.alertSuccess("Marketplace deleted.");
		this.close();
		this.get("user").reload();
	},

	actions: {
		save: function() {
			var user = this.get("user");
			var marketplaceId = this.get("marketplace.id");

			this.executeAction(function() {
				return user.removeMarketplace(marketplaceId);
			});
		}
	}
});

MarketplaceDeleteModalView.reopenClass({
	open: function(user, marketplace) {
		return this.create({
			marketplace: marketplace,
			user: user,
		});
	}
});

export default MarketplaceDeleteModalView;
