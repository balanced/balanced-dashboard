Balanced.AccountSecurityController = Balanced.ObjectController.extend({
	needs: ['marketplaces'],

	content: null,
	auth_code_confirm: null,
	submitted: false,
	hasError: false,
	status: 'disabled',

	error: function(field, prefix) {
		var errors = this.get('validationErrors.' + field + '.messages');
		if (errors) {
			var error = errors[0];
			if (error.indexOf(prefix) !== 0) {
				error = prefix + ' ' + error;
			}
			return error;
		}
	},

	disable_label: function() {
		var status = this.get('status');

		if (status === 'disabled') {
			return 'Disabled';
		} else {
			return 'Disable';
		}
	}.property('status'),

	enable_label: function() {
		var status = this.get('status');

		if (status === 'disabled') {
			return 'Enable';
		} else if (status === 'enabling') {
			return 'Enabling';
		} else {
			return 'Enabled';
		}
	}.property('status'),

	isEnabling: function() {
		return this.get('status') === 'enabling';
	}.property('status'),

	isNotEnabling: function() {
		return this.get('status') !== 'enabling';
	}.property('status'),

	isDisabled: function() {
		return this.get('status') === 'disabled';
	}.property('status'),

	isEnabled: function() {
		return this.get('status') === 'enabled';
	}.property('status'),

	loadQRCode: function() {
		console.log('loadQRCode');
		var otpSecret = Balanced.Auth.get('OTPSecret');

		if ($.fn.qrcode) {
			$('#qrcode').qrcode(otpSecret.secret_uri);
		} else {
			setTimeout(this.loadQRCode, 100);
		}
	},

	actions: {
		enableAuth: function() {
			var self = this;
			Balanced.Auth.enableMultiFactorAuthentication();

			Balanced.Auth.one('enableAuthSuccess', function() {
				self.set('status', 'enabling');
				self.loadQRCode();
			});
		},
		disableAuth: function() {
			var self = this;
			Balanced.Auth.disableMultiFactorAuthentication();

			Balanced.Auth.one('disableAuthSuccess', function() {
				self.set('status', 'disabled');
				$('#qrcode').html('');
			});
		},
		activateAuth: function() {
			var self = this;
			console.log(this.get('auth_code_confirm'));
			Balanced.Auth.confirmOTP(this.get('auth_code_confirm'));

			Balanced.Auth.one('confirmOTP', function() {
				self.set('status', 'enabled');
			});
		}
	}
});
