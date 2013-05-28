Balanced.Download = Balanced.Model.extend({
    _propertiesMap: function () {
        return {
            email_address: this.email_address,
            uri: this.uri
        };
    },

    create: function () {
        var self = this;
        var data = this._propertiesMap();

        self.set('isSaving', true);
        Balanced.Adapter.create(this.constructor, '/downloads', data, function (json) {
            self._updateFromJson(json);
            self.set('isNew', false);
            self.set('isSaving', false);
            self.set('isValid', true);
            self.set('isError', false);
            self.trigger('didCreate');
        }, $.proxy(self._handleError, self));
    }
});


Balanced.Download.reopenClass({
});


Balanced.Adapter.registerHostForType(Balanced.Download, ENV.BALANCED.WWW);
