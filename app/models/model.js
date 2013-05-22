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

        Balanced.Adapter.create(this.constructor, this.get('uri'), data, function (json) {
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
                prop !== 'uri' &&
                prop !== 'id') {
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

    requiresMarketplaceParamForCreate: true,
    requiresMarketplaceParamForFind: false,

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

        var authedUri = uri;
        if(modelObject.requiresMarketplaceParamForFind) {
            authedUri = Balanced.Model._appendMarketplaceAuthParam(uri);
        }

        Balanced.Adapter.get(modelClass, authedUri, function (json) {
            modelObject._updateFromJson(json);
            modelObject.set('isLoaded', true);
            modelObject.trigger('didLoad');
        });

        return modelObject;
    },

    belongsTo: function (type, propertyName, settings) {
        var modelClass = this;
        return Ember.computed(function () {
            settings = settings || {};
            var typeClass = modelClass._typeClass(type);

            // if the property hasn't been set yet, don't bother trying to load it
            if (this.get(propertyName)) {
                if(settings.embedded) {
                    var embeddedObj = typeClass.create();
                    embeddedObj.set('isNew', false);
                    embeddedObj._updateFromJson(this.get(propertyName));
                    return embeddedObj;
                } else {
                    return typeClass.find(this.get(propertyName));
                }
            } else {
                return null;
            }
        }).property(propertyName);
    },

    hasMany: function (type, propertyName, settings) {
        var modelClass = this;
        return Ember.computed(function () {
            settings = settings || {};
            var typeClass = modelClass._typeClass(type);

            var modelObjectsArray = Ember.A();

            // if the property hasn't been set yet, don't bother trying to load it
            if (this.get(propertyName)) {
                var populateModels = function(json) {
                    var typedObjects = _.map(json.items, function (item) {
                        var typedObj = typeClass.create();
                        typedObj.set('isNew', false);
                        typedObj._updateFromJson(item);

                        // if an object is deleted, remove it from the collection
                        typedObj.on('didDelete', function () {
                            modelObjectsArray.removeObject(typedObj);
                        });

                        return typedObj;
                    });

                    modelObjectsArray.setObjects(typedObjects);
                    modelObjectsArray.set('isLoaded', true);
                };

                if(settings.embedded) {
                    populateModels(this.get(propertyName));
                } else {
                    modelObjectsArray.set('isLoaded', false);
                    Balanced.Adapter.get(typeClass, this.get(propertyName), function (json) {
                        populateModels(json);
                    });
                }
            }

            return modelObjectsArray;
        }).property(propertyName);
    },

    _typeClass: function(type) {
        // allow dependencies to be set using strings instead of class
        // statements so we don't have ordering issues when declaring our
        // models
        var typeClass = type;
        //  HACK: this gets around the jshint eval warning but let's clean this up.
        var a = eval;
        if (typeof type === 'string') {
            typeClass = a(type);
        }

        return typeClass;
    }
});
