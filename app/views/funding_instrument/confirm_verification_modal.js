Balanced.ConfirmVerificationModalView = Balanced.View.extend({
	templateName: 'modals/confirm_verification',

	failedConfirmation: false,

	didInsertElement: function() {
		this.get('controller').on('openConfirmVerificationModal', this, this.open);
	},

	willDestroyElement: function() {
		this.get('controller').off('openConfirmVerificationModal', this, this.open);
	},

	open: function() {
		this.set('failedConfirmation', false);
		var verification = this.get('funding_instrument.verification');
		this.set('model', verification);
		$('#confirm-verification').modal({
			manager: this.$()
		});
	},

	actions: {
		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			var self = this;

			var verification = this.get('model');
			verification.save().then(function() {
				$('#confirm-verification').modal('hide');
			}, function() {
				if (verification.get('errorStatusCode') === 409) {
					self.set('failedConfirmation', true);
				}

				self.get('controller').reloadVerifications(verification);
			});
		}
	},

	amount_1_highlight: function() {
		return this.get('failedConfirmation') || this.get('model.validationErrors.amount_1');
	}.property('failedConfirmation', 'model.validationErrors.amount_1'),

	amount_2_highlight: function() {
		return this.get('failedConfirmation') || this.get('model.validationErrors.amount_2');
	}.property('failedConfirmation', 'model.validationErrors.amount_12')
});
