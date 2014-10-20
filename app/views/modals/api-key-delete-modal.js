import Ember from "ember";
import ModalBaseView from "./modal-base";
import Auth from "balanced-dashboard/auth";

var ApiKeyDeleteModalView = ModalBaseView.extend({
	templateName: "modals/api-key-delete-modal",
	title: "Delete this key",
	elementId: "api-key-delete",
	classNames: ["wide-modal"],

	isSaving: false,
	actions: {
		save: function(key) {
			var self = this;
			var newKey;
			var secret = key.get('secret');
			var userMarketplace = self.get("container").lookup("controller:marketplace/settings").get("userMarketplace");

			if (secret === userMarketplace.get("secret")) {
				newKey = userMarketplace.get('keys')
					.filterBy('secret')
					.rejectBy("secret", secret)
					.objectAt(0);
				if (!newKey) {
					return;
				}
				Auth.setAPIKey(newKey.secret);
				userMarketplace.updateSecret(newKey.secret);
			}

			self.set("isSaving", true);
			key.delete()
				.finally(function() {
					userMarketplace.get("marketplaceApiKeys").reload();
					self.set("isSaving", false);
					self.close();
				});
		}
	}
});

ApiKeyDeleteModalView.reopenClass({
	open: function(apiKey) {
		return this.create({
			apiKey: apiKey
		});
	},
});

export default ApiKeyDeleteModalView;
