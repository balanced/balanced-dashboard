Balanced.AccountSecurityController = Balanced.ObjectController.extend({
	needs: ['marketplaces'],

	content: null,
	auth_code_confirm: null,
	submitted: false,
	hasError: false,
	status: 'disabled',
	authError: false,

	reset: function() {
		this.setProperties({
			submitted: false,
			hasError: false,
			authError: false
		});
	},

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
			return 'Off';
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
			return 'On';
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
		var self = this;

		$.getScript('//cdnjs.cloudflare.com/ajax/libs/jquery.qrcode/1.0/jquery.qrcode.min.js', function() {
			var otpSecret = Balanced.Auth.get('OTPSecret');

			if ($.fn.qrcode) {
				$('#qrcode').qrcode(otpSecret.secret_uri);
			} else {
				setTimeout(_.bind(self.loadQRCode, self), 100);
			}
		});
	},

	actions: {
		enableAuth: function() {
			var self = this;

			Balanced.Auth.enableMultiFactorAuthentication().done(function() {
				self.set('status', 'enabling');
				self.loadQRCode();
			});
		},
		disableAuth: function() {
			var self = this;

			Balanced.Auth.disableMultiFactorAuthentication().done(function() {
				self.set('status', 'disabled');
				$('#qrcode').html('');
			});
		},
		activateAuth: function() {
			var self = this;

			Balanced.Auth.confirmOTP(this.get('auth_code_confirm')).then(function() {
				self.set('status', 'enabled');
				$('#qrcode').html('');
			}, function() {
				self.setProperties({
					authError: true,
					auth_code_confirm: null
				});
			});
		}
	}
});
