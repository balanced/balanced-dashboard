Balanced.Model = Ember.Object.extend({

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

  find: function(uri) {
    var modelClass = this;
    var modelObject = modelClass.create({uri: uri});

    if(this.fixureMap) {
      // if the fixtures have been set up, must be testing this class, so fetch locally
      var json = this.fixureMap[uri];
      if(json) {
        if(this.deserialize) {
          this.deserialize(json);
        }
        modelObject.setProperties(json);
      }
    } else {
      // if no fixtures defined, use AJAX to fetch from the server
      var host = ENV.BALANCED.API;
      if(this.host) {
        host = this.host(uri);
      }
      this.ajax(host + uri, "GET").then(function(json) {
        if(this.deserialize) {
          this.deserialize(json);
        }

        modelObject.setProperties(json);
      });
    }

    return modelObject;
  },

  constructFixtures: function(fixtureArray) {
    this.fixureMap = {};
    _.each(fixtureArray, function(fixture) {
      this.fixureMap[fixture.uri] = fixture;
    }, this);
  },

  ajax: function(url, type, settings) {
    settings = settings || {};
    settings.url = url;
    settings.type = type;
    settings.context = this;
    return Auth.ajax(settings);
  }
});