Balanced.ConfirmVerificationModalView = Balanced.View.extend({
    templateName: 'modals/confirm_verification',

    failedConfirmation: false,

    didInsertElement: function () {
        this.get('controller').on('openConfirmVerificationModal', this, this.open);
    },

    willDestroyElement: function () {
        this.get('controller').off('openConfirmVerificationModal', this, this.open);
    },

    amount_1_highlight: function() {
        return this.get('failedConfirmation') || this.get('model.validationErrors.amount_1');
    }.property('failedConfirmation', 'model.validationErrors.amount_1'),

    amount_2_highlight: function() {
        return this.get('failedConfirmation') || this.get('model.validationErrors.amount_2');
    }.property('failedConfirmation', 'model.validationErrors.amount_12'),

    open: function () {
        this.set('failedConfirmation', false);
        var verification = this.get('funding_instrument.verification');
        this.set('model', verification);
        $('#confirm-verification').modal('show');
    },

    save: function () {
        if (this.get('model.isSaving')) {
            return;
        }

        var self = this;

        var verification = this.get('model');
        verification.update().then(function () {
            self.get('funding_instrument').refresh();
            self.get('funding_instrument.verification').refresh();
            self.get('funding_instrument.verifications').refresh();
            $('#confirm-verification').modal('hide');
        }, function() {
            if(verification.get('errorStatusCode') === 409) {
                self.set('failedConfirmation', true);
            }

            self.get('funding_instrument.verification').refresh();
            self.get('funding_instrument.verifications').refresh();
        });
    }
});
