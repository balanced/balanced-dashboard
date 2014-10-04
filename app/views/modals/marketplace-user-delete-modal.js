import ErrorsLogger from "balanced-dashboard/lib/errors-logger";
import ModalBaseView from "./modal-base";

var MarketplaceUserDeleteModalView = ModalBaseView.extend({
	classNameBindings: [":wide-modal", ":modal-overflow"],
	elementId: "marketplace-user-delete",
	templateName: "modals/marketplace-user-delete-modal",
	title: "Delete user",

	isSaving: false,
	actions: {
		submit: function(userInvite) {
			var self = this;
			self.set("isSaving", true);
			userInvite.delete()
				.then(function() {
					self.get("container").lookup("controller:marketplace/settings").send("reloadUsers");
					self.close();
				})
				.finally(function() {
					self.set("isSaving", false);
				});
		}
	}
});

MarketplaceUserDeleteModalView.reopenClass({
	open: function(userInvite) {
		return this.create({
			userInvite: userInvite
		});
	}
});

export default MarketplaceUserDeleteModalView;
