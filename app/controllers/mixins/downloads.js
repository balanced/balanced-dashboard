Balanced.DownloadControllerMixin = Ember.Mixin.create({
    needs: ['marketplace'],

    show_download: false,

    openDownload: function () {
        var uri = this.getSearchUri();
        var download = Balanced.Download.create({
            uri: uri,
            email_address: null
        });
        this.set('model', download);
        this.set('show_download', true);
    },

    closeDownload: function () {
        this.set('show_download', false);
    },

    download: function () {
        if (this.get('model.isSaving')) {
            return;
        }

        if (this.get('model.email_address')) {
            var self = this;
            this.get('model').create().then(function () {
                self.closeDownload();
                self.confirmDownload();
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
