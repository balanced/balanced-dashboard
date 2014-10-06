import ModalBaseView from "./modal-base";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";
import Full from "./mixins/full-modal-mixin";
import Auth from "balanced-dashboard/auth";

var EnableAuthModalView = ModalBaseView.extend(Full, Form, {
	title: "Enable two-factor authentication",
	description: "Two-factor authentication adds another layer of security to your dashboard account. In addition to your login email and password, you'll need to enter an authentication code from Balanced using your Google Authenticator app on your smartphone.",
	elementId: "enable-mfa",
	templateName: "modals/enable-auth-modal",
	cancelButtonText: "Cancel",
	submitButtonText: "Enable",
	auth_code_confirm: null,

	actions: {
		save: function() {
			var self = this;
			Auth.confirmOTP(this.get('auth_code_confirm')).then(function() {
				Auth.get("user").reload();
				self.$('#qrcode').html('');
				self.close();
				self.set('auth_code_confirm', null);
				self.getNotificationController()
					.alertSuccess('Two-factor authentication is enabled.');
			}, function(response) {
				self.getModalNotificationController()
					.alertError(response.responseJSON.detail);
				self.set('auth_code_confirm', null);
			});
		}
	},

	didInsertElement: function() {
		var self = this;
		Auth.enableMultiFactorAuthentication()
			.then(function() {
				$.getScript('//cdnjs.cloudflare.com/ajax/libs/jquery.qrcode/1.0/jquery.qrcode.min.js')
					.then(function() {
						var otpSecret = Auth.get('OTPSecret');
						if ($.fn.qrcode) {
							self.$('#qrcode').qrcode(otpSecret.secret_uri);
						}
					});
			});
	}
});

export default EnableAuthModalView;
