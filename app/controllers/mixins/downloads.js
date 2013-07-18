Balanced.DownloadControllerMixin = Ember.Mixin.create({
    needs: ['marketplace'],

    show_download: false,

    email_address: null,

    isSubmitting: false,

    openDownload: function () {
        this.set('isSubmitting', false);
        this.set('email_address', null);
        this.set('show_download', true);
    },

    closeDownload: function () {
        this.set('isSubmitting', false);
        this.set('show_download', false);
    },

    download: function () {
        if (this.get('isSubmitting')) {
            return;
        }

        var uri = this.getSearchUri();
        if (this.email_address) {
            var download = Balanced.Download.create({
                uri: uri,
                email_address: this.get('email_address')
            });

            this.set('isSubmitting', true);
            var self = this;
            download.create().then(function () {
                self.set('isSubmitting', false);
                self.closeDownload();
                self.confirmDownload();
            }, function () {
                self.set('isSubmitting', false);
            });
        }
        return false;
    },

    getSearchUri: function () {
        return window.location.hash.substr(1);
    },

    confirmDownload: function () {
        this.get('controllers.marketplace').send('alertMessage', {
            type: 'success',
            message: 'We\'re processing your request. We will email you once ' +
                'the exported data is ready to view.'
        });
    }
});
