require('app/models/mixins/load_promise');

var get = Ember.get, set = Ember.set;

Balanced.ModelArray = Ember.ArrayProxy.extend(Balanced.LoadPromise, {
  content: [],

  isLoaded: false,

  objectAtContent: function(index) {
    var content = get(this, 'content'),
        reference = content.objectAt(index);

    if (reference) {
      return reference;
    }
  },

  materializedObjectAt: function(index) {
    var reference = get(this, 'content').objectAt(index);
    if (!reference) { return; }

    if (get(this, 'store').recordIsMaterialized(reference)) {
      return this.objectAt(index);
    }
  },

  update: function() {
    if (get(this, 'isUpdating')) { return; }

    var store = get(this, 'store'),
        type = get(this, 'type');

    store.fetchAll(type, this);
  },

  addReference: function(reference) {
    get(this, 'content').addObject(reference);
  },

  removeReference: function(reference) {
    get(this, 'content').removeObject(reference);
  }
});
