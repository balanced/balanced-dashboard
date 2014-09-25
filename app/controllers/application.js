import Ember from "ember";
import AnalyticsLogger from "balanced-dashboard/utils/analytics_logger";

var ApplicationController = Ember.Controller.extend(Ember.Evented, {
	needs: ["notification_center", "marketplace"],

	actions: {
		signUp: function() {
			AnalyticsLogger.trackEvent("SignUp: Opened 'Create an account' modal", {
				path: this.get("container").lookup("controller:application").get('currentRouteName')
			});
			this.transitionToRoute('setup_guest_user');
		},

		register: function() {
			AnalyticsLogger.trackEvent("SignUp: Opened 'Register for production access' modal", {
				path: this.get("container").lookup("controller:application").get('currentRouteName')
			});
			this.transitionToRoute('marketplaces.apply');
		},

		openChangePasswordModal: function() {
			if (this.get('auth.isGuest')) {
				return;
			}

			this.trigger('openChangePasswordModal');
		},

		openVerifyBankAccountLink: function() {
			var bankAccountsController = this.get("container").lookup("controller:bank_accounts");
			var bankAccount = this.get("controllers.marketplace.model.owner_customer.bank_accounts.firstObject");
			this.transitionToRoute('bank_accounts', bankAccount).then(function(route) {
				_.delay(function() {
					var controller = route && route.routeName ?
						route.get('controller') :
						bankAccountsController;

					if (!controller) {
						return;
					}

					if (bankAccount.get("can_verify")) {
						controller.trigger('openVerifyBankAccountModal');
					} else if (bankAccount.get("can_confirm_verification")) {
						controller.trigger("openConfirmVerificationModal");
					}

				});
			});
		},

		openChangeEmailModal: function() {
			if (this.get('auth.isGuest')) {
				return;
			}

			this.trigger('openChangeEmailModal');
		}
	}
});

export default ApplicationController;
