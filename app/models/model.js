Balanced.Model = Ember.Object.extend(Ember.Evented, {
    date_formats: {
        short: '%e %b \'%y %l:%M %p'
    },

    human_readable_created_at: function () {
        if (this.get('created_at')) {
            return Date.parseISO8601(this.get('created_at')).strftime(this.date_formats.short);
        } else {
            return "";
        }
    }.property('created_at'),

  update: function(fields) {
    var self = this;
    var data = {};
    // TODO - would it be better to have a dirty fields list like ember data does?
    _.each(fields, function(field) {
      data[field] = self.get(field);
    });
    Balanced.Adapter.update(this.constructor, this.get('uri'), data, function(json) {
      self._updateFromJson(json);

      self.trigger('didUpdate');
      // TODO - handle errors
    });
  },

  _updateFromJson: function(json) {
    if (!json) {
        return;
    }

    if(this.constructor.deserialize) {
      this.constructor.deserialize(json);
    }

    this.setProperties(json);
    this.set('isLoaded', true);
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

  find: function(uri, settings) {
    var modelClass = this;
    // this terrible hack ('#x') is for unit tests, we are firing an
    // "onLoad" event by waiting for the uri to change. all API objects
    // have a URI so this will change once it is loaded.
    var modelObject = modelClass.create({uri: uri});
    modelObject.set('isLoaded', false);

    // pull out the observer if it's present
    settings = settings || {};
    var observer = settings.observer;
    if (observer) {
        // this allows us to subscribe to events on this object without
        // worrying about any race conditions
        modelObject.addObserver('isLoaded', observer);
    }
    delete settings.observer;

    Balanced.Adapter.get(modelClass, uri, function(json) {
      modelObject._updateFromJson(json);
      modelObject.trigger('didLoad');
    });

    return modelObject;
  },

  hasMany: function(type, uriPropertyName) {
    return Ember.computed(function() {
      // allow dependencies to be set using strings instead of class statements so we don't have ordering issues when declaring our models
      var typeClass = type;
      if(typeof type === "string") {
        typeClass = eval(type);
      }

      var modelObjectsArray = Ember.A();
      modelObjectsArray.set('isLoaded', false);

      // if the URI property hasn't been set yet, don't bother trying to load it
      if(this.get(uriPropertyName)) {
        Balanced.Adapter.get(typeClass, this.get(uriPropertyName), function(json) {
          if(typeClass.deserialize) {
            _.each(json.items, function(item) {
              typeClass.deserialize(item);
            });
          }
          var typedObjects = _.map(json.items, function(item) {
            return typeClass.create(item);
          })
          modelObjectsArray.setObjects(typedObjects);
          
          modelObjectsArray.set('isLoaded', true);
        });
      }

      return modelObjectsArray;
    }).property(uriPropertyName);
  }
});
