Balanced.Model = Ember.Object.extend({
    date_formats: {
        short: '%e %b \'%y %l:%M %p'
    },

    human_readable_created_at: function () {
        if (this.get('created_at')) {
            return Date.parseISO8601(this.get('created_at')).strftime(this.date_formats.short);
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

    function load(json) {
        if (!json) {
            return;
        }
        if (modelClass.deserialize) {
            modelClass.deserialize(json);
        }
        modelObject.setProperties(json);
        modelObject.set('isLoaded', true);
    }

    Balanced.Adapter.get(modelClass, uri, load);

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
          modelObjectsArray.setObjects(json.items);
          
          modelObjectsArray.set('isLoaded', true);
        });
      }

      return modelObjectsArray;
    }).property(uriPropertyName);
  }
});
