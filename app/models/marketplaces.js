require('app/models/store');

/* A wrapper around localStorage,
 which is what Balanced uses. This is scoped
 locally to this file.
 */
var store = Balanced.Store.create({
    name: 'balanced-ember-example'
});


Balanced.Marketplace = DS.Model.extend({
    /*
     A reference to the singleton instance of the 
     localStorage wrapper.

     Used to auto-save Marketplace instances when they change. 
     */
    store: store,

    name: DS.attr('string'),
    in_escrow: DS.attr('number'),
    uri: DS.attr('string'),

    /*
     Observer that will react on item change and will update the storage.
     */
    marketplaceChanged: function () {
//        store.update(this);
    }.observes('name')
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
     Removes a model from the store.
     */
    destroy: function (model) {
        this.store.destroy(model);
    }
});
