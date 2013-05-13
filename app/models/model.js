Balanced.Model = Ember.Object.extend({

    human_readable_created_at: function () {
        if (this.get('created_at')) {
            return Date.parseISO8601(this.get('created_at')).strftime('%b %d');
        } else {
            return "";
        }
    }.property('created_at')

});

Balanced.Model.reopenClass({
    /* deserialize - override this with a function to transform the json before it's used
     *
     * Example:
     * Balanced.Test.reopenClass({
     *   deserialize: function(json) {
     *     json.anotherProperty = "value";
     *   }
     * });
     */
    deserialize: null,

    /* host - override this with a function that returns the host to be used to fetch the URI
     *
     * Example:
     * Balanced.Test.reopenClass({
     *   host: function(uri) {
     *     return "my.domain.com";
     *   }
     * });
     */
    host: null,

    find: function (uri, settings) {
        var modelClass = this;
        // this terrible hack ('#x') is for unit tests, we are firing an
        // "onLoad" event by waiting for the uri to change. all API objects
        // have a URI so this will change once it is loaded.
        var modelObject = modelClass.create({uri: uri + '#x'});

        // pull out the observer if it's present
        settings = settings || {};
        var observer = settings.observer;
        if (observer) {
            // this allows us to subscribe to events on this object without
            // worrying about any race conditions
            modelObject.addObserver('uri', observer);
        }
        delete settings.observer;

        function load(json) {
            if (!json) {
                return;
            }
            if (modelClass.deserialize) {
                modelClass.deserialize(json);
            }
            modelObject.setProperties(json);
        }

        if (this.fixureMap) {
            // if the fixtures have been set up, must be testing this class, so fetch locally
            var json = this.fixureMap[uri];
            load(json);
        } else {
            // if no fixtures defined, use AJAX to fetch from the server
            var host = ENV.BALANCED.API;
            if (this.host) {
                host = this.host(uri);
            }
            this.ajax(host + uri, 'GET', settings).then(load);
        }

        return modelObject;
    },

    constructFixtures: function (fixtureArray) {
        this.fixureMap = {};
        _.each(fixtureArray, function (fixture) {
            this.fixureMap[fixture.uri] = fixture;
        }, this);
    },

    ajax: function (url, type, settings) {
        settings = settings || {};
        settings.url = url;
        settings.type = type;
        settings.context = this;
        return Balanced.Auth.send(settings);
    }
});
