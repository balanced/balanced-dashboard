require('app/models/core/mixins/load_promise');
require('app/models/core/model_array');
require('app/models/core/type_mappings');

Balanced.Model = Ember.Object.extend(Ember.Evented, Ember.Copyable, Balanced.LoadPromise, {

    isLoaded: false,
    isSaving: false,
    isDeleted: false,
    isError: false,
    isNew: true,
    isValid: true,

    //  properties which are not echoed back to the server
    privateProperties: ['id', 'uri'],

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

        self.set('isSaving', true);

        var promise = this.resolveOn('didCreate');

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
                $.inArray(prop, this.privateProperties) === -1 &&
                prop.indexOf('__ember') < 0 &&
                prop.indexOf('_super') < 0 &&
                Ember.typeOf(this.get(prop)) !== 'function'
                ) {
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

    /*
     * Used for adding a one-to-one association to a model.
     *
     * Params:
     *  - type - Used to find/construct child objects. For embedded objects,
     * we'll use the _type field if it's present in the JSON. For non-embedded
     * objects, we use this type to construct the object
     * - propertyName - The property whose value we'll get to determine the URI
     *  or embedded data to use for the association
     * - settings - The only setting that's current supported is embedded = [true|false].
     *
     * Example:
     *
     * Balanced.Marketplace = Balanced.MarketplaceLite.extend({
     *      owner_customer: Balanced.Model.belongsTo('Balanced.Customer', 'owner_customer_json', {embedded: true})
     * });
     */
    belongsTo: function (type, propertyName, settings) {
        var modelClass = this;
        return Ember.computed(function () {
            settings = settings || {};
            var typeClass = Balanced.TypeMappings.typeClass(type);

            // if the property hasn't been set yet, don't bother trying to load it
            if (this.get(propertyName)) {
                if (settings.embedded) {
                    var embeddedObj = typeClass._materializeLoadedObjectFromAPIResult(this.get(propertyName));
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

    /*
     * Used for adding a one-to-many association to a model.
     *
     * Params:
     *  - defaultType - Used to find/construct child objects. If the _type
     * field is present in the returned JSON, we'll map that to create objects
     * of the correct type. Since we use the type of object to pick which host
     * to use, it's important to set the defaultType, even if your returned
     * data uses the _type field.
     * - propertyName - The property whose value we'll get to determine the URI
     *  or embedded data to use for the association
     * - settings - The only setting that's current supported is embedded = [true|false].
     *
     * Example:
     *
     * Balanced.Marketplace = Balanced.MarketplaceLite.extend({
     *      credits: Balanced.Model.hasMany('Balanced.Credit', 'credits_uri'),
     *      customers: Balanced.Model.hasMany('Balanced.Customer', 'customers_json', {embedded: true})
     * });
     */
    hasMany: function (defaultType, propertyName, settings) {
        var modelClass = this;
        return Ember.computed(function () {
            settings = settings || {};
            var typeClass = Balanced.TypeMappings.typeClass(defaultType);

            var modelObjectsArray = Balanced.ModelArray.create({ content: Ember.A(), typeClass: typeClass });

            // if the property hasn't been set yet, don't bother trying to load it
            if (this.get(propertyName)) {
                if (settings.embedded) {
                    modelObjectsArray.populateModels(this.get(propertyName));
                } else {
                    modelObjectsArray.set('isLoaded', false);
                    Balanced.Adapter.get(typeClass, this.get(propertyName), function (json) {
                        modelObjectsArray.populateModels(json);
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

    _materializeLoadedObjectFromAPIResult: function (json) {
        var objClass = this;
        if (json._type) {
            var mappedTypeClass = Balanced.TypeMappings.classForType(json._type);
            if (mappedTypeClass) {
                objClass = mappedTypeClass;
            }
        }
        var typedObj = objClass.create();
        typedObj.set('isNew', false);
        typedObj._updateFromJson(json);
        typedObj.trigger('didLoad');
        return typedObj;
    }
});
