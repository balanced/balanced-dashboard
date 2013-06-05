Balanced.DownloadControllerMixin = Ember.Mixin.create({

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
            download.one('didCreate', function () {
                self.download_close();
            }).one('becameError', function () {
                //  TODO:
            });
            download.create();
        } else {
            self.download_close();
        }
    },

    getSearchUri: function () {
        return window.location.hash.substr(1);
    },

    download_close: function () {
        this.set('show_download', false);
    },
    download_show: function () {
        this.set('show_download', true);
    }
});
