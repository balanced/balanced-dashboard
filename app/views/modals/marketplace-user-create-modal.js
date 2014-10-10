import ErrorsLogger from "balanced-dashboard/lib/errors-logger";
import ModalBaseView from "./modal-base";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";

var MarketplaceUserCreateModalView = ModalBaseView.extend(Form, {
	classNameBindings: [":wide-modal"],
	elementId: "marketplace-user-create",
	templateName: "modals/marketplace-user-create-modal",
	title: "Add a user",
	cancelButtonText: "Cancel",
	submitButtonText: "Add",

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
		save: function() {
			var self = this;
			var userInvite = this.get("userInvite");
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
