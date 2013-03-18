require('app/models/store');

/* A wrapper around localStorage,
 which is what Balanced uses. This is scoped
 locally to this file.
 */
var store = Balanced.Store.create({
    name: 'balanced-ember-example'
});

/*
 A Simple Marketplace prototype.

 It has properties of 
 `id`, and `title` although
 it's not necessary to define them on the prototype.
 They'll get set through user interaction and default to `null` until then.

 It also has a property of `completed` which defaults
 to false
 */
Balanced.Marketplace = Ember.Object.extend({
    completed: false,
    /*
     A reference to the singleton instance of the 
     localStorage wrapper.

     Used to auto-save Marketplace instances when they change. 
     */
    store: store,

    /*
     Observer that will react on item change and will update the storage.
     */
    marketplaceChanged: function () {
        store.update(this);
    }.observes('name', 'completed')
});


/* 
 Constructor/Class/Static/Whatever properties of Marketplace.
 */
Balanced.Marketplace.reopenClass({
    /*
     A reference to the singleton instance of the 
     localStorage wrapper.

     Used to load existing Marketplace and store newly
     created Marketplaces. 
     */
    store: store,

    /*
     Create a new instance of a Marketplace object with
     the passed properties and then
     passes it to the store for persistence.

     */
    createRecord: function (properties) {
        return this.store.createRecord(this.create(properties));
    },

    /*
     Removes a model from the store.
     */
    destroy: function (model) {
        this.store.destroy(model);
    },

    /*
     Find all the models in the store. This is a computed
     property on the store, so feel free to call it
     as often as you like: until todos are added or removed
     it will always return the cached value.
     */
    all: function () {
        return this.store.all();
    }
});
