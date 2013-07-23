Balanced.ConfirmVerificationModalView = Balanced.View.extend({
    templateName: 'modals/confirm_verification',

    didInsertElement: function () {
        this.get('controller').on('openConfirmVerificationModal', this, this.open);
    },

    willDestroyElement: function () {
        this.get('controller').off('openConfirmVerificationModal', this, this.open);
    },

    open: function () {
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
            self.get('funding_instrument.verification').refresh();
            self.get('funding_instrument.verifications').refresh();
            $('#confirm-verification').modal('hide');
        }, function() {
            self.get('funding_instrument.verification').refresh().then(function(verification) {
                if(verification.get('remaining_attempts') === 0) {
                    $('#confirm-verification').modal('hide');
                }
            });
            self.get('funding_instrument.verifications').refresh();
        });
    }
});
