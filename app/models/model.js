require('app/models/mixins/load_promise');
require('app/models/model_array');


Balanced.Model = Ember.Object.extend(Ember.Evented, Ember.Copyable, Balanced.LoadPromise, {

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

    // computes the ID from the URI - exists because at times Ember needs the 
    // ID of our model before it has finished loading. This gets overridden 
    // when the real model object gets loaded by the ID value from the JSON 
    // attribute
    id: function () {
        var uri = this.get('uri');
        return uri.substring(uri.lastIndexOf('/') + 1);
    }.property('uri'),

    create: function () {
        var self = this;
        var data = this._toSerializedJSON();

        var promise = this.resolveOn('didCreate');

        self.set('isSaving', true);
        Balanced.Adapter.create(this.constructor, this.get('uri'), data, function (json) {
            self._updateFromJson(json);
            self.set('isNew', false);
            self.set('isSaving', false);
            self.set('isValid', true);
            self.set('isError', false);
            self.trigger('didCreate');
        }, $.proxy(self._handleError, self));

        return promise;
    },

    update: function () {
        var self = this;
        var data = this._toSerializedJSON();

        self.set('isSaving', true);

        var promise = this.resolveOn('didUpdate');

        Balanced.Adapter.update(this.constructor, this.get('uri'), data, function (json) {
            self._updateFromJson(json);

            self.set('isSaving', false);
            self.set('isValid', true);
            self.set('isError', false);

            self.trigger('didUpdate');
        }, $.proxy(self._handleError, self));

        return promise;
    },

    delete: function () {
        var self = this;

        self.set('isDeleted', true);
        self.set('isSaving', true);

        var promise = this.resolveOn('didDelete');

        Balanced.Adapter.delete(this.constructor, this.get('uri'), function (json) {
            self.set('isSaving', false);
            self.trigger('didDelete');
        }, $.proxy(self._handleError, self));

        return promise;
    },

    refresh: function () {
        var self = this;
        this.set('isLoaded', false);

        var promise = this.resolveOn('didLoad');

        Balanced.Adapter.get(this.constructor, this.get('uri'), function (json) {
            self._updateFromJson(json);
            self.set('isLoaded', true);
            self.trigger('didLoad');
        }, $.proxy(self._handleError, self));

        return promise;
    },

    copy: function () {
        var modelObject = this.constructor.create({uri: this.get('uri')});
        var props = this._toSerializedJSON();
        modelObject._updateFromJson(props);
        return modelObject;
    },

    updateFromModel: function (modelObj) {
        var modelProps = modelObj._propertiesMap();
        this.setProperties(modelProps);
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

    _toSerializedJSON: function () {
        var json = this._propertiesMap();

        if (this.constructor.serialize) {
            this.constructor.serialize(json);
        }

        return json;
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
        var computedProps = [];
        this.constructor.eachComputedProperty(function (prop) {
            computedProps.push(prop);
        });

        var lifecycleProperties = ['isLoaded', 'isNew', 'isSaving', 'isValid', 'isError', 'isDeleted'];

        var props = {};
        for (var prop in this) {
            if (this.hasOwnProperty(prop) &&
                $.inArray(prop, computedProps) === -1 &&
                $.inArray(prop, lifecycleProperties) === -1 &&
                prop.indexOf('__ember') < 0 &&
                prop.indexOf('_super') < 0 &&
                Ember.typeOf(this.get(prop)) !== 'function' &&
                prop !== 'uri' &&
                prop !== 'id') {
                props[prop] = this[prop];
            }
        }

        return props;
    },

    resolveOn: function (successEvent) {
        var model = this;
        var deferred = Ember.Deferred.create();

        function success() {
            model.off('becameError', error);
            model.off('becameInvalid', error);
            deferred.resolve(model);
        }

        function error() {
            model.off(successEvent, success);
            deferred.reject(model);
        }

        model.one(successEvent, success);
        model.one('becameError', error);
        model.one('becameInvalid', error);

        return deferred;
    }
});

Balanced.Model.reopenClass({
    /* deserialize - override this with a function to transform the json before it's used
     *
     * Example:
     * Balanced.Test.reopenClass({
     *   deserialize: function(json) {
     *     json.anotherProperty = 'value';
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
        }, $.proxy(modelObject._handleError, modelObject));

        return modelObject;
    },

    belongsTo: function (type, propertyName, settings) {
        var modelClass = this;
        return Ember.computed(function () {
            settings = settings || {};
            var typeClass = modelClass._typeClass(type);

            // if the property hasn't been set yet, don't bother trying to load it
            if (this.get(propertyName)) {
                if (settings.embedded) {
                    var embeddedObj = typeClass.create();
                    embeddedObj.set('isNew', false);
                    embeddedObj._updateFromJson(this.get(propertyName));
                    embeddedObj.trigger('didLoad');
                    return embeddedObj;
                } else {
                    return typeClass.find(this.get(propertyName));
                }
            } else {
                // return a class of this type so dependent properties don't crap out on null
                var emptyObj = typeClass.create();
                emptyObj.set('isNew', false);
                return emptyObj;
            }
        }).property(propertyName);
    },

    hasMany: function (type, propertyName, settings) {
        var modelClass = this;
        return Ember.computed(function () {
            settings = settings || {};
            var typeClass = modelClass._typeClass(type);

            var modelObjectsArray = Balanced.ModelArray.create({ content: Ember.A() });

            // if the property hasn't been set yet, don't bother trying to load it
            if (this.get(propertyName)) {
                var populateModels = function (json) {
                    var itemsArray;
                    if (json && $.isArray(json)) {
                        itemsArray = json;
                    } else {
                        if (json && json.items && $.isArray(json.items)) {
                            itemsArray = json.items;
                        } else {
                            modelObjectsArray.set('isError', true);
                            return;
                        }
                    }

                    var typedObjects = _.map(itemsArray, function (item) {
                        var typedObj = typeClass.create();
                        typedObj.set('isNew', false);
                        typedObj._updateFromJson(item);
                        typedObj.trigger('didLoad');

                        // if an object is deleted, remove it from the collection
                        typedObj.on('didDelete', function () {
                            modelObjectsArray.removeObject(typedObj);
                        });

                        return typedObj;
                    });

                    modelObjectsArray.setObjects(typedObjects);
                    modelObjectsArray.set('isLoaded', true);
                    modelObjectsArray.trigger('didLoad');
                };

                if (settings.embedded) {
                    populateModels(this.get(propertyName));
                } else {
                    modelObjectsArray.set('isLoaded', false);
                    Balanced.Adapter.get(typeClass, this.get(propertyName), function (json) {
                        populateModels(json);
                    }, function (jqXHR, textStatus, errorThrown) {
                        if (jqXHR.status === 400) {
                            this.set('isValid', false);
                            this.trigger('becameInvalid', jqXHR.responseText);
                        } else {
                            this.set('isError', true);
                            this.trigger('becameError', jqXHR.responseText);
                        }
                    });
                }
            }

            return modelObjectsArray;
        }).property(propertyName);
    },

    _typeClass: function (type) {
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
