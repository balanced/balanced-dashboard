Balanced.AccountSecurityController = Balanced.ObjectController.extend(Ember.Evented, {
	needs: ['marketplaces', 'marketplace', 'application', "temporary_alerts"],

	content: null,
	auth_code_confirm: null,
	submitted: false,
	hasError: false,
	status: 'disabled',
	authError: false,
	application: Ember.computed.alias("controllers.application"),

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

		return {
			'disabled': 'Enable',
			'enabling': 'Enabling',
			'enabled': 'On'
		}[status] || 'On';
	}.property('status'),

	isEnabling: Ember.computed.equal('status', 'enabling'),

	isNotEnabling: Ember.computed.not('isEnabling'),

	isDisabled: Ember.computed.equal('status', 'disabled'),

	isEnabled: Ember.computed.equal('status', 'enabled'),

	loadQRCode: function() {
		var self = this;

		$.getScript('//cdnjs.cloudflare.com/ajax/libs/jquery.qrcode/1.0/jquery.qrcode.min.js')
			.then(function() {
				var otpSecret = self.get('auth.OTPSecret');

				if ($.fn.qrcode) {
					$('#qrcode').qrcode(otpSecret.secret_uri);
				} else {
					setTimeout(_.bind(self.loadQRCode, self), 100);
				}
			});
	},

	actions: {
		openDisableMFAModal: function(router, evt) {
			if (this.get('isEnabled')) {
				$('#disable-mfa').modal();
			} else {
				this.send('disableAuth');
			}
		},
		enableAuth: function(router, evt) {
			var self = this;

			this.get('auth').enableMultiFactorAuthentication()
				.then(function() {
					self.set('status', 'enabling');
					self.loadQRCode();
				});
		},
		disableAuth: function(router, evt) {
			var self = this;

			this.get('auth').disableMultiFactorAuthentication()
				.then(function() {
					self.set('status', 'disabled');
					$('#qrcode').html('');

					self.get('controllers.temporary_alerts')
						.alertSuccess('Two-factor authentication is now disabled.', 3000);

					self.send('goBack');
				});
		},
		activateAuth: function(router, evt) {
			var self = this;

			this.get('auth').confirmOTP(this.get('auth_code_confirm')).then(function() {
				self.set('status', 'enabled');
				$('#qrcode').html('');

				self.get('controllers.temporary_alerts')
					.alertSuccess('Two-factor authentication is now enabled.');

				self.send('goBack');
			}, function() {
				self.setProperties({
					authError: true,
					auth_code_confirm: null
				});
			});
		}
	}
});
