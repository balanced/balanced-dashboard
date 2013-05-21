Balanced.Model = Ember.Object.extend(Ember.Evented, {

    isLoaded: false,
    isSaving: false,
    isDeleted: false,
    isError: false,
    isNew: true,
    isValid: true,

    date_formats: {
        short: '%e %b \'%y %l:%M %p'
    },

    human_readable_created_at: function () {
        if (this.get('created_at')) {
            return Date.parseISO8601(this.get('created_at')).strftime(this.date_formats.short);
        } else {
            return '';
        }
    }.property('created_at'),

    create: function () {
        var self = this;
        var data = this._propertiesMap();

        self.set('isSaving', true);
        var creationUri = this.get('creation_uri');
        if (typeof creationUri === 'function') {
            creationUri = creationUri();
        }
        Balanced.Adapter.create(this.constructor, creationUri, data, function (json) {
            self._updateFromJson(json);
            self.set('isNew', false);
            self.set('isSaving', false);
            self.set('isValid', true);
            self.set('isError', false);
            self.trigger('didCreate');
        }, $.proxy(self._handleError, self));
    },

    update: function () {
        var self = this;
        var data = this._propertiesMap();

        self.set('isSaving', true);

        Balanced.Adapter.update(this.constructor, this.get('uri'), data, function (json) {
            self._updateFromJson(json);

            self.set('isSaving', false);
            self.set('isValid', true);
            self.set('isError', false);

            self.trigger('didUpdate');
        }, $.proxy(self._handleError, self));
    },

    delete: function () {
        var self = this;

        self.set('isDeleted', true);
        self.set('isSaving', true);

        Balanced.Adapter.delete(this.constructor, this.get('uri'), function (json) {
            self.set('isSaving', false);
            self.trigger('didDelete');
        }, $.proxy(self._handleError, self));
    },

    _updateFromJson: function (json) {
        if (!json) {
            return;
        }

        if (this.constructor.deserialize) {
            this.constructor.deserialize(json);
        }

        this.setProperties(json);
        this.set('isLoaded', true);
    },

    _handleError: function (jqXHR, textStatus, errorThrown) {
        this.set('isSaving', false);
        if (jqXHR.status === 400) {
            this.set('isValid', false);
            this.trigger('becameInvalid', jqXHR.responseText);
        } else {
            this.set('isError', true);
            this.trigger('becameError', jqXHR.responseText);
        }
    },

    // Taken from http://stackoverflow.com/questions/9211844/reflection-on-emberjs-objects-how-to-find-a-list-of-property-keys-without-knowi
    _propertiesMap: function () {
        var props = {};
        for (var prop in this) {
            if (this.hasOwnProperty(prop) &&
                prop.indexOf('__ember') < 0 &&
                prop.indexOf('_super') < 0 &&
                Ember.typeOf(this.get(prop)) !== 'function' &&
                prop !== 'uri') {
                props[prop] = this[prop];
            }
        }
        return props;
    }
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

    find: function (uri, settings) {
        var modelClass = this;
        var modelObject = modelClass.create({uri: uri});
        modelObject.set('isLoaded', false);
        modelObject.set('isNew', false);

        // pull out the observer if it's present
        settings = settings || {};
        var observer = settings.observer;
        if (observer) {
            // this allows us to subscribe to events on this object without
            // worrying about any race conditions
            modelObject.addObserver('isLoaded', observer);
        }

        Balanced.Adapter.get(modelClass, uri, function (json) {
            modelObject._updateFromJson(json);
            modelObject.set('isLoaded', true);
            modelObject.trigger('didLoad');
        });

        return modelObject;
    },

    hasMany: function (type, uriPropertyName) {
        return Ember.computed(function () {
            // allow dependencies to be set using strings instead of class
            // statements so we don't have ordering issues when declaring our
            // models
            var typeClass = type;
            //  HACK: this gets around the jshint eval warning but let's clean this up.
            var a = eval;
            if (typeof type === 'string') {
                typeClass = a(type);
            }

            var modelObjectsArray = Ember.A();
            modelObjectsArray.set('isLoaded', false);

            // if the URI property hasn't been set yet, don't bother trying to load it
            if (this.get(uriPropertyName)) {
                Balanced.Adapter.get(typeClass, this.get(uriPropertyName), function (json) {
                    if (typeClass.deserialize) {
                        _.each(json.items, function (item) {
                            typeClass.deserialize(item);
                        });
                    }
                    var typedObjects = _.map(json.items, function (item) {
                        var typedObj = typeClass.create(item);

                        // if an object is deleted, remove it from the collection
                        typedObj.on('didDelete', function () {
                            modelObjectsArray.removeObject(typedObj);
                        });

                        return typedObj;
                    });

                    modelObjectsArray.setObjects(typedObjects);
                    modelObjectsArray.set('isLoaded', true);
                });
            }

            return modelObjectsArray;
        }).property(uriPropertyName);
    }
});
