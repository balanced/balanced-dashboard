import Ember from "ember";
import Auth from "balanced-dashboard/auth";

var UsersTableComponent = Ember.Component.extend({
	actions: {
		delete: function(userInvite) {
			this.get("container").lookup("controller:application")
				.send("openModal", "modals/marketplace-user-delete-modal", userInvite);
		}
	}
});

export default UsersTableComponent;
