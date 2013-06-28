Balanced.DownloadControllerMixin = Ember.Mixin.create({
    needs: ['marketplace'],

    show_download: false,

    email_address: null,

    openDownload: function() {
        this.set('email_address', null);
        this.set('show_download', true);
    },

    closeDownload: function() {
        this.set('show_download', false);
    },

    download: function () {
        var uri = this.getSearchUri();
        if (this.email_address) {
            var download = Balanced.Download.create({
                uri: uri,
                email_address: this.get('email_address')
            });
            download.one('didCreate', $.proxy(this.closeDownload, this));
            download.one('didCreate', $.proxy(this.confirmDownload, this));
            download.create();
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
