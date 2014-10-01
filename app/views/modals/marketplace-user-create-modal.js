import ErrorsLogger from "balanced-dashboard/lib/errors-logger";
import ModalBaseView from "./modal-base";

var MarketplaceUserCreateModalView = ModalBaseView.extend({
	classNameBindings: [":wide-modal", ":modal-overflow"],
	elementId: "marketplace-user-create",
	templateName: "modals/marketplace-user-create-modal",
	title: "Add user",

	buildApiKey: function(emailAddress) {
		var apiKey = this.get("container").lookupFactory("model:api-key").create();
		apiKey.set("meta", Ember.Object.create({
			name: emailAddress
		}));
		return apiKey;
	},

	validateAndSave: function(userInvite) {
		var self = this;
		userInvite.validate();
		if (userInvite.get("isValid")) {
			return this
				.buildApiKey(userInvite.get("email_address"))
				.save()
				.then(function(apiKey) {
					userInvite.set('secret', apiKey.get('secret'));
					return userInvite.save();
				})
				.then(function() {
					var controller = self.get("container").lookup("controller:marketplace/settings");
					controller.send("reloadUsers");
				});
		}
		else {
			return Ember.RSVP.reject();
		}
	},

	isSaving: false,
	actions: {
		submit: function(userInvite) {
			var self = this;
			self.set("isSaving", true);
			this.validateAndSave(userInvite)
				.then(function() {
					self.close();
				})
				.finally(function() {
					self.set("isSaving", false);
				});
		}
	}
});

MarketplaceUserCreateModalView.reopenClass({
	open: function(usersUri) {
		var userInvite = BalancedApp.__container__.lookupFactory("model:user-invite").create({
			uri: usersUri,
			email_address: ''
		});

		return this.create({
			userInvite: userInvite
		});
	}
});

export default MarketplaceUserCreateModalView;
