Balanced.LoginController = Balanced.ObjectController.extend({
    model: function () {
        return Balanced.Login.find('current');
    },
    login: function (data) {
        var login = Balanced.Login.createRecord(data);
        // this appears to force the op to be flushed to the API. probably not
        // the way to do this but done for now.
        login.transaction.commit();
        login.addObserver('isLoaded', this.refresh);
    },
    logout: function (data) {
        Ember.set('Balanced.currentLogin', null);
    },
    refresh: function (login, event) {
        if (!login) {
            return;
        }
        //  isLoaded seems to be set to true even when the object hasn't loaded
        // the data (e.g. uri is null). checking for password is a hack around
        // this.
        if (login.get('isLoaded') && !login.get('password')) {
            // no url indicates failed login attempt, it's probably better to
            // have a failure handler but i haven't figured this out yet.
            if (!login.get('uri')) {
                login = null;
            }
            Ember.set('Balanced.currentLogin', login);
        }
    }
});
