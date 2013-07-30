Balanced.DownloadControllerMixin = Ember.Mixin.create({
    needs: ['marketplace'],

    download_model: null, 
    show_download: false,

    openDownload: function () {
        var uri = this.getSearchUri();
        var download = Balanced.Download.create({
            uri: uri,
            email_address: null
        });
        this.set('download_model', download);
        this.set('show_download', true);
    },

    closeDownload: function () {
        this.set('show_download', false);
    },

    download: function () {
        if (this.get('download_model.isSaving')) {
            return;
        }

        if (this.get('download_model.email_address')) {
            var self = this;
            this.get('download_model').create().then(function () {
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
