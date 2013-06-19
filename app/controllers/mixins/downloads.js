Balanced.DownloadControllerMixin = Ember.Mixin.create({
    needs: ['marketplace'],
    show_download: false,
    email_address: null,

    download_primary: function () {
        var uri = this.getSearchUri();
        var self = this;
        if (this.email_address) {
            var download = Balanced.Download.create({
                uri: uri,
                email_address: this.get('email_address')
            });
            download.one('didCreate', $.proxy(this.download_close, this));
            download.one('didCreate', $.proxy(this.download_confirmation, this));
            download.create();
        } else {
            self.download_close();
        }
    },

    getSearchUri: function () {
        return window.location.hash.substr(1);
    },

    download_confirmation: function () {
        this.get('controllers.marketplace').send('alertMessage', {
            type: 'success',
            message: 'We\'re processing your request. We will email you once ' +
                'the exported data is ready to view.'
        });
    },

    download_close: function () {
        this.set('show_download', false);
    },
    download_show: function () {
        this.set('show_download', true);
    }
});
