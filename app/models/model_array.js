require('app/models/mixins/load_promise');

Balanced.ModelArray = Ember.ArrayProxy.extend(Balanced.LoadPromise, {
  isLoaded: false
});
