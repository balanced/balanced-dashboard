import UserMarketplace from "balanced-dashboard/models/user-marketplace";
import ErrorsLogger from "balanced-dashboard/lib/errors-logger";
import ModalBaseView from "./modal-base";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";

var ApiKeyCreateModalView = ModalBaseView.extend(Form, {
	classNameBindings: [":wide-modal"],
	elementId: "api-key-create",
	templateName: "modals/api-key-create-modal",
	title: "Add an API key",
	isSaving: false,
	cancelButtonText: "Cancel",
	submitButtonText: "Add",

	buildApiKey: function(name) {
		var model = this.get("container").lookup("model:api-key");
		model.setProperties({
			meta: {
				name: name
			}
		});
		return model;
	},

	buildUserMarketplace: function(uri, key) {
		var klass = this.get("container").lookupFactory("model:user-marketplace");
		return klass.create({
			uri: uri,
			secret: key.get('secret')
		});
	},

	getApiKeysUri: function() {
		return this.get("container").lookup("auth:main").get("user.api_keys_uri");
	},

	actions: {
		save: function() {
			var self = this;
			var userMarketplace = self.get("container").lookup("controller:marketplace/settings").get("userMarketplace");

			self.set("isSaving", true);
			self.buildApiKey(self.get('keyName'))
				.save()
				.then(function(newKey) {
					return self.buildUserMarketplace(self.getApiKeysUri(), newKey)
						.save();
				})
				.then(undefined, function(error) {
					if (error.error !== "Unauthorized") {
						ErrorsLogger.captureMessage(error);
					}
				})
				.finally(function() {
					userMarketplace.get("marketplaceApiKeys").reload();
					self.set("isSaving", false);
					self.close();
				});
		}
	}
});

ApiKeyCreateModalView.reopenClass({
	open: function() {
		return this.create({});
	}
});

export default ApiKeyCreateModalView;
