require('app/models/store');


var store = Balanced.Store.create({
    name: 'balanced-ember-example'
});


Balanced.Auth = DS.Model.extend({
    store: store,

    email_address: DS.attr('string'),
    user_uri: DS.attr('string')
});


Balanced.Auth.reopenClass({
    store: store,

    /*
     Removes a model from the store.
     */
    destroy: function (model) {
        this.store.destroy(model);
    }
});
