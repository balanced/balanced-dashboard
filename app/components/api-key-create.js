import ModalComponent from "./modal";
import ApiKey from "balanced-dashboard/models/api-key";
import UserMarketplace from "balanced-dashboard/models/user-marketplace";
import ErrorsLogger from "balanced-dashboard/lib/errors-logger";

var ApiKeyCreateModalComponent = ModalComponent.extend({
	keyName: '',
	actions: {
		createKey: function() {
			this.hide();
			var self = this;
			ApiKey.create({
				meta: {
					name: self.get('keyName')
				}
			}).save()
				.then(function(newKey) {
					self.get('keys').unshiftObject(newKey);
					self.set('keyName', '');

					UserMarketplace.create({
						uri: self.get('user.api_keys_uri'),
						secret: newKey.get('secret')
					}).save().then(function() {}, function(error) {
						if (error.error !== "Unauthorized") {
							ErrorsLogger.captureMessage(error);
						}
					});
				});
		}
	}
});

export default ApiKeyCreateModalComponent;
